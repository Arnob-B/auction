import { RedisClientType, createClient } from "redis";
import { inputType } from "../types/in";
import { messagesFromApiType } from "../types/streamType";
export default class redisManager{
  private client:RedisClientType; // takes from queue
  private publisher:RedisClientType; // publishes to the sub
  private static instance: redisManager ;
  private initiated:boolean;
  private constructor(){
    console.log("redis Manager instialization started");
    this.client = createClient();
    this.publisher = createClient();
    this.client.connect();
    this.publisher.connect();
    this.initiated = false;
    this.init();
  }
  public async init(){
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
  public async pullQueue():Promise<messagesFromApiType>{
    const res = await this.client.rPop("messagesFromApi" as string);
    return JSON.parse(res);
  }
  public async publish(uid:string,msg:string){
    await this.publisher.publish(uid,msg);
  }
};
