import { addPlayer, addPlayerBody, banUser, changeNextPrice, changeNextPriceBody, control, getCurrentPlayer, messagesFromApiType, placeBid, placeBidBody, sellPlayer } from "../types/streamType";
import player from "./playerManager";
import redisManager from "./redisManager";
import { user, userManager } from "./userManager";
import wsManager from "./wsManager";
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
    await this.addAllUser();
  }
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
  public static getInstance(){
    if(this.instance) return this.instance;
    return this.instance = new engineManager();
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
    let response = "";
    switch(msg.type){
      case getCurrentPlayer:
        {
          const response = this.getCurrentPlayer();
          this.publishToApi(msg.clientId, response);
          break;
        }
      case addPlayer:
        {
          const response = await this.listPlayer(msg.body);
          this.publishToApi(msg.clientId, response);
          break;
        }
      case placeBid:
        {
          if(!this.bidContinue) {redisManager.getInstance().publish(msg.clientId,"Biddin is paused for now");break;}
          const response = await this.placeBid(msg.body);
          this.publishToApi(msg.clientId, response);
          break;
        }
      case banUser:
        {
          const response = await this.banUser(msg.body);
          this.publishToApi(msg.clientId, response);
          break;
        }
      case sellPlayer:
        {
          const response = await this.sellPlayer();
          this.publishToApi(msg.clientId, response);
          break;
        }
      case control:
        {
          const response = await this.controls(msg.body);
          this.publishToApi(msg.clientId, response);
          break;
        }
      case changeNextPrice:
        {
          const response = await this.changeNextPrice(msg.body);
          this.publishToApi(msg.clientId, response);
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
    //db call
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
              // db queue push
              wsManager.getInstance().bidPlaced();
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
    // publishing
    return "new price set" + playerObj.nextPrice;
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
      //db call to update player profile
    }
    return "playerSold";
  }
  public async banUser(body:{userId:string}){
    const msg = userManager.getInstance().banUser(body.userId);
    //db call
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
    redisManager.getInstance().publish('WsPubSub',JSON.stringify(
      {
        type: "CONTROL",
        state:body.state
      }
    ));
    return msg;
  }
}