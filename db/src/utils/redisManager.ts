import { RedisClientType, createClient } from "redis";
import { bidPlacedType, dbMessageType, newPlayerListedType, playerSoldType, userBannedType } from "../types/wsPubSubStream";
import dbManager from "./dbManager";
export default class redisManager{
  private client:RedisClientType; // takes from queue
  private static instance: redisManager ;
  private initiated:boolean;
  private constructor(){
    console.log("redis Manager instialization started");
    this.client = createClient();
    this.client.connect();
    this.initiated = false;
    this.init();
  }
  public async init(){
    await this.client;
    console.log("redis Manager instialization completed");
    this.initiated=true;
  }
  public static getInstance(): redisManager {
    if (this.instance)
      return this.instance;
    else {
       this.instance = new redisManager();
       return this.instance;
    }
  }
  public async descisionMaker(res:dbMessageType){
    switch(res.type){
      case newPlayerListedType:{
        await dbManager.getInstance().playerListed(res.body.playerId);
        break;
      }
      case bidPlacedType:{
        await dbManager.getInstance().storeBid(res.body.playerId,res.body.bidderId, res.body.amount);
        break;
      }
      case playerSoldType:{
        await dbManager.getInstance().playerSold(res.body.playerId, res.body.bidderId, res.body.amount);
        break;
      }
      case userBannedType:{
        await dbManager.getInstance().banUser(res.body.userId);
        break;
      }
    }
  }
  public async pullQueue(){
    const res = await this.client.rPop("DBMESSAGES" as string);
    if(res)
    return JSON.parse(res);
    return null;
  }
}