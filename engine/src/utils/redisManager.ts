import { RedisClientType, createClient } from "redis";
import { inputType } from "../types/in";
import { messagesFromApiType } from "../types/streamType";
import player from "./playerManager";
export default class redisManager{
  private client:RedisClientType; // takes from queue
  private publisher:RedisClientType; // publishes to the sub and also the userPubsub
  private pushToDB:RedisClientType;
  private static instance: redisManager ;
  private initiated:boolean;
  private constructor(){
    console.log("redis Manager instialization started");
    this.client = createClient();
    this.publisher = createClient();
    this.pushToDB = createClient();
    this.client.connect();
    this.publisher.connect();
    this.pushToDB.connect();
    this.initiated = false;
    this.init();
  }
  public async init(){
    await this.client;
    await this.publisher;
    await this.pushToDB;
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
  public async pullQueue():Promise<messagesFromApiType|null>{
    const res = await this.client.rPop("messagesFromApi" as string);
    if(res)
    return JSON.parse(res);
    return null
  }
  public async publish(uid:string,msg:string){
    await this.publisher.publish(uid,msg);
  }
  public async pushToDBQueue(msgType:string){
    let msg = {};
    if(msgType === "STOREBID"){
       msg = {
        type:msgType,
        playerId:player.getInstance().id,
        bidderId:player.getInstance().currentWinningBidder,
        amount:player.getInstance().currentPrice,
      }
    }
    else if(msgType === "LISTPLAYER"){
      msg = {
        type:msgType,
        playerId: player.getInstance().id,
      }
    }
    else if (msgType === "PLAYERSOLD") {
      msg = {
        type:msgType,
        playerId:player.getInstance().id,
        bidderId:player.getInstance().currentWinningBidder,
        ammount:player.getInstance().currentPrice,
      }
    }
    else if (msgType === "USERBANNED") {
      msg = {
        type:msgType,
        userId:player.getInstance().currentWinningBidder,
      }
    }
    this.pushToDB.lPush("DBMSG", JSON.stringify(msg));
  }
};
