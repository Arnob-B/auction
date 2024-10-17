import { addPlayer, addPlayerBody, banUser, changeNextPrice, changeNextPriceBody, control, getCurrentPlayer, messagesFromApiType, placeBid, placeBidBody, sellPlayer } from "../types/streamType";
import player from "./playerManager";
import redisManager from "./redisManager";
import { userManager } from "./userManager";
import userSeed from "./userSeed";

export class engineManager{
  private static instance:engineManager;
  private bidContinue:boolean;
  private constructor(){
    redisManager.getInstance();
    userManager.getInstance();
    player.getInstance();
    this.init()
    this.bidContinue = true;
  }
  private async init(){
    await redisManager.getInstance();
    await this.addAllUser();
    this.runEngine();
  }
  public static getInstance(){
    if(this.instance) return this.instance;
    return this.instance = new engineManager();
  }
  public getStatus(){return this.bidContinue?"START":"STOP";}
  private async addAllUser(){
    userManager.getInstance().allUsers = [];
    userManager.getInstance().bannedUser = [];
    console.log("user addition started");
    console.log("db call made");
    // db call to get all the users from db;
    // db call to get all the users from db;
    console.log("users succesfully fetched from db");
    let count = userSeed.length;
    count/=10;
    count =Math.floor(count);
    process.stdout.write(`<`);
    for(let a=0;a<userSeed.length;a++){
      await new Promise((res)=>{
        setTimeout(()=>{
          userManager.getInstance().addUser(userSeed[a].id, userSeed[a].name, userSeed[a].balance);
          res('');
        },20)
      })
      if(a%count==0)process.stdout.write(`=`);
    }
    process.stdout.write(`>\n`);
    console.log("users added sucessfully");
  }
  public async publishToApi(clientId:string,msg:string){
    await redisManager.getInstance().publish(clientId,msg);
  }
  public async runEngine(){
    while(true){
      let msg = await redisManager.getInstance().pullQueue();
      if(msg){
        console.log(msg.type);
        await this.descisionMaker(msg);
        console.log("resolved");
      }
    }
  }
  public async descisionMaker(msg:messagesFromApiType){
    switch(msg.type){
      case getCurrentPlayer:
        {
          const responseToApi = this.getCurrentPlayer();
          await this.publishToApi(msg.clientId, responseToApi);
          break;
        }
      case addPlayer:
        {
          const responseToApi = await this.listPlayer(msg.body);
          await this.publishToApi(msg.clientId, responseToApi);
          break;
        }
      case placeBid:
        {
          if(!this.bidContinue) {redisManager.getInstance().publish(msg.clientId,"Biddin is paused for now");break;}
          const responseToApi = await this.placeBid(msg.body);
          this.publishToApi(msg.clientId, responseToApi);
          break;
        }
      case banUser:
        {
          const responseToApi = await this.banUser(msg.body);
          this.publishToApi(msg.clientId, responseToApi);
          break;
        }
      case sellPlayer:
        {
          const responseToApi = await this.sellPlayer();
          this.publishToApi(msg.clientId, responseToApi);
          break;
        }
      case control:
        {
          const responseToApi = await this.controls(msg.body);
          this.publishToApi(msg.clientId, responseToApi);
          break;
        }
      case changeNextPrice:
        {
          const responseToApi = await this.changeNextPrice(msg.body);
          this.publishToApi(msg.clientId, responseToApi);
          break;
        }
    }
  }
  public getCurrentPlayer():string{
    return JSON.stringify({
      id: player.getInstance().id,
      name: player.getInstance().name,
      basePrice: player.getInstance().basePrice,
      currentPrice: player.getInstance().currentPrice,
      nextBid: player.getInstance().nextPrice
    });
  }
  public async listPlayer(body:addPlayerBody):Promise<string>{
    const msg = player.getInstance().setPlayer(body);
    if (msg !== "playerAlreadyInBid") {
      const obj = player.getInstance();
      const response = {
        type: "NEWPLAYERLISTED",
        body: {
          playerId: obj.id,
          playerName: obj.name,
          basePrice: obj.basePrice,
          currentPrice: obj.nextPrice,
        }
      }
      //publish to ws pub sub
      await redisManager.getInstance().publishToWs(JSON.stringify(response));
      //db call
    }
    return msg;
  }
  public async placeBid(body:placeBidBody):Promise<string>{
    const { playerId, bidderId, bidAmnt } = body;
    if (player.getInstance().getPlayerId() === playerId) {
      if (bidAmnt === player.getInstance().nextPrice) {
        if (!userManager.getInstance().isBanned(bidderId)) {
          const user = userManager.getInstance().allUsers.find(e => e.getDetails().userId === bidderId);
          if (user) {
            if (bidderId === player.getInstance().currentWinningBidder) return "you are the current winning bidder";
            if (user.getDetails().balance < bidAmnt) return  "you dont have sufficient money";
            else {
              player.getInstance().currentWinningBidder = bidderId;
              // updating the player 
              player.getInstance().currentPrice = bidAmnt;
              player.getInstance().nextPrice = player.getInstance().currentPrice + player.getInstance().incrementPrice;
              const response = {
                type:"BID_PLACED",
                body:{
                  palyerId:player.getInstance().id,
                  bidderId:user.getDetails().userId,
                  bidderName:user.getDetails().userName,
                  amount:player.getInstance().currentPrice,
                  nextPrice:player.getInstance().nextPrice
                }
              }
              //publish to ws pub sub
              await redisManager.getInstance().publishToWs(JSON.stringify(response));
              // db queue push
              return "bid placed";
            }
          } else return "you are not registered for the auction";
        } else return "you are banned";
      } else return "price is not upto the bid mark";
    } else return "you chose wrong player";
  }
  public async changeNextPrice(body:changeNextPriceBody){
    const playerObj = player.getInstance();
    playerObj.incrementPrice = body.incrementPrice;
    playerObj.nextPrice = playerObj.currentPrice + playerObj.incrementPrice;
    const response = {
      type:"NEW_BID_PRICE",
      body:{
        playerId:player.getInstance().id,
        nextPrice:player.getInstance().nextPrice
      }
    }
    // publishing to ws pubsub 
    await redisManager.getInstance().publishToWs(JSON.stringify(response));
    return "new price set " + playerObj.nextPrice;
  }
  public async sellPlayer(){
    const winnerId = player.getInstance().currentWinningBidder;
    if( winnerId === ""){
      //db call with player remaining unsold
    }
    else{
      const ind = userManager.getInstance().allUsers.findIndex(e=> e.getDetails().userId === winnerId);
      let bal = userManager.getInstance().allUsers[ind].getDetails().balance;
      userManager.getInstance().allUsers[ind].setBalance(bal - player.getInstance().currentPrice);
      const response = {
        type:"PLAYER_SOLD",
        playerId:player.getInstance().id,
        bidderId:userManager.getInstance().allUsers[ind].getDetails().userId,
        bidderName:userManager.getInstance().allUsers[ind].getDetails().userName,
        amount:player.getInstance().currentPrice
      }
      //publish to ws pub sub
      await redisManager.getInstance().publishToWs(JSON.stringify(response));
      //db call to update player profile
    }
    return "playerSold";
  }
  public async banUser(body:{userId:string}){
    const msg = userManager.getInstance().banUser(body.userId);
    if(msg !== "userAlreadyInBanList"){
      const obj = userManager.getInstance().allUsers.find(e=>e.getDetails().userId === body.userId);
      const response = {
        type:"USER_BANNED",
        userId: obj?.getDetails().userName,
        userName: obj?.getDetails().userName,
      }
      //dbcall
      //publish to ws
      await redisManager.getInstance().publishToWs(JSON.stringify(response));
    }
    return msg;
  }
  public async controls(body:{state:string}){
    let msg = "";
    if(body.state === "START")
    {
      this.bidContinue = true;
      msg = "bidding started";
    }
    else if(body.state === "STOP")
    {
      this.bidContinue = false;
      msg = "bidding stopped";
    }
    const response = {
      type: "CONTROL",
      state: body.state
    }
    //publish to ws
    await redisManager.getInstance().publishToWs(JSON.stringify(response));
    return msg;
  }
}