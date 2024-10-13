import { RedisClientType, createClient } from "redis";
import { addPlayerBody, messagesFromApiType } from "./types/streamType";
export default class redisManager{
  private client:RedisClientType;
  private publisher:RedisClientType;
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
  public async publish({type,body}:messagesFromApiType):Promise<string>{
    try {
      await this.publisher.lPush("messagesFromApi", JSON.stringify({
        type:type,
        body:body
      }));
      return "success";
    }
    catch (err) {
      console.log(err);
      return "failed";
    }
  }
};