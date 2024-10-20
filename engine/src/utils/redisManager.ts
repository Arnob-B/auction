import { RedisClientType, createClient } from "redis";
import { inputType } from "../types/in";
import { messagesFromApiType } from "../types/streamType";
import player from "./playerManager";
import { engineManager } from "./engineManager";
import { userManager } from "./userManager";
import { wsPublishMsg } from "../types/wsPSubStreamTypes";
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
  public async publishToWs(response: wsPublishMsg) {
    await this.publisher.publish("WSMESSAGE",JSON.stringify(response))
  }
  public async pushToDBQueue(msg:wsPublishMsg){
    await this.pushToDB.lPush("DBMESSAGE", JSON.stringify(msg));
  }
};
