import { PrismaClient } from "@prisma/client";
import { addPlayer, addPlayerBody, banUser, changeNextPrice, changeNextPriceBody,  getCurrentPlayer, messagesFromApiType, placeBid, placeBidBody, sellPlayer, setControl } from "../types/streamType";
import { bidPlaced, getControl, newBidPrice, newPlayerListed, playerSold, userBanned } from "../types/wsPSubStreamTypes";
import player from "./playerManager";
import redisManager from "./redisManager";
import { userManager } from "./userManager";
import dotenv from "dotenv"
dotenv.config();

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
  private async addAllUser(){
    const client = new PrismaClient();
    userManager.getInstance().allUsers = [];
    userManager.getInstance().bannedUser = [];
    console.log("user addition started");
    console.log("db call made");
    // db call to get all the users from db;
    const res = await client.user.findMany({
      select:{
        id:true,
        name:true,
        balance:true,
        isBanned:true,
        players:{
          select:{id:true}
        },
      },
    });
    // db call to get all the users from db;
    console.log("users succesfully fetched from db");
    for(let a of res)
    {
      if(a.isBanned){
        userManager.getInstance().banUser(a.id);
      }
      userManager.getInstance().addUser(a.id,a.name,a.balance,a.players.length);
    }
    console.log("users added sucessfully");
    console.log(userManager.getInstance().allUsers.length);
    console.log(userManager.getInstance().bannedUser.length);
  }
  public testCheck(){
    userManager.getInstance().allUsers.forEach((a)=>{
      console.log(a.getDetails().userId,a.getDetails().playerCount);
    })
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
      case setControl:
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
      const response:newPlayerListed = {
        type: "NEW_PLAYER_LISTED",
        body: {
          playerId: obj.id,
          playerName: obj.name,
          basePrice: obj.basePrice,
          currentPrice: obj.nextPrice,
        }
      }
      //publish to ws pub sub
      await redisManager.getInstance().publishToWs(response);
      //db call
      await redisManager.getInstance().pushToDBQueue(response);
    }
    return msg;
  }
  public async placeBid(body:placeBidBody):Promise<string>{
    if(!this.bidContinue) return "can't bid now as bidding is paused";
    const { playerId, bidderId, bidAmnt } = body;
    if ( playerId !== "" && player.getInstance().getPlayerId() === playerId) {
      if (bidAmnt === player.getInstance().nextPrice) {
        if (!userManager.getInstance().isBanned(bidderId)) {
          const user = userManager.getInstance().allUsers.find(e => e.getDetails().userId === bidderId);
          if (user) {
            //checking if current winning bidder or not
            if (bidderId === player.getInstance().currentWinningBidder) return "you are the current winning bidder";

            //checking for max hold a player can
            //by default env variables are treated as string
            if(process.env.MAX_HOLD !== undefined){if(user.getDetails().playerCount >= parseInt(process.env.MAX_HOLD)) return "your limit to buy payer has been reached";}

            //checking for sufficient balance
            if (user.getDetails().balance < bidAmnt) return  "you dont have sufficient money";
            else {
              player.getInstance().currentWinningBidder = bidderId;
              // updating the player 
              player.getInstance().currentPrice = bidAmnt;
              player.getInstance().nextPrice = player.getInstance().currentPrice + player.getInstance().incrementPrice;
              const response:bidPlaced = {
                type:"BID_PLACED",
                body:{
                  playerId:player.getInstance().id,
                  bidderId:user.getDetails().userId,
                  bidderName:user.getDetails().userName,
                  amount:player.getInstance().currentPrice,
                  nextPrice:player.getInstance().nextPrice
                }
              }
              //publish to ws pub sub
              await redisManager.getInstance().publishToWs(response);
              // db queue push
              await redisManager.getInstance().pushToDBQueue(response);
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
    const response:newBidPrice = {
      type:"NEW_BID_PRICE",
      body:{
        playerId:player.getInstance().id,
        nextPrice:player.getInstance().nextPrice
      }
    }
    // publishing to ws pubsub 
    await redisManager.getInstance().publishToWs(response);
    return "new price set " + playerObj.nextPrice;
  }
  public async sellPlayer() {
    const winnerId = player.getInstance().currentWinningBidder;
    let response: playerSold;
    this.controls({state:"STOP"});
    if (winnerId === "") {
      response = {
        type: "PLAYER_SOLD",
        body: {
          playerId: player.getInstance().id,
          playerName: player.getInstance().name,
          bidderId: "",
          bidderName: "No one",
          amount: 0
        }
      }
    }
    else {
      const ind = userManager.getInstance().allUsers.findIndex(e => e.getDetails().userId === winnerId);
      let bal = userManager.getInstance().allUsers[ind].getDetails().balance;
      //reducing the balance
      userManager.getInstance().allUsers[ind].setBalance(bal - player.getInstance().currentPrice);
      //incrementing the player hold
      userManager.getInstance().allUsers[ind].incrementPlayerCount();
      response = {
        type: "PLAYER_SOLD",
        body: {
          playerId: player.getInstance().id,
          playerName: player.getInstance().name,
          bidderId: userManager.getInstance().allUsers[ind].getDetails().userId,
          bidderName: userManager.getInstance().allUsers[ind].getDetails().userName,
          amount: player.getInstance().currentPrice
        }
      }
    }
    //seting up new player as ""
    player.getInstance().setPlayer({
      playerId: "",
      playerName: "",
      playerBasePrice: 0
    });
    //publish to ws pub sub
    await redisManager.getInstance().publishToWs(response);
    //db call with player remaining unsold
    await redisManager.getInstance().pushToDBQueue(response);
    return "playerSold";
  }
  public async banUser(body:{userId:string}){
    const msg = userManager.getInstance().banUser(body.userId);
    if(msg !== "userAlreadyInBanList"){
      const obj = userManager.getInstance().allUsers.find(e=>e.getDetails().userId === body.userId);
      if (obj) {
        const response: userBanned = {
          type: "USER_BANNED",
          body: {
            userId: obj.getDetails().userId,
            userName: obj.getDetails().userName,
          }
        }
        //dbcall
        await redisManager.getInstance().pushToDBQueue(response);
        //publish to ws
        await redisManager.getInstance().publishToWs(response);
      }
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
    const response:getControl = {
      type: "CONTROL",
      body:{state: body.state === "START"? "START":"STOP"}
    }
    //publish to ws
    await redisManager.getInstance().publishToWs(response);
    return msg;
  }
}