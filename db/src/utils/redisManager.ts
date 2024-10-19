import { RedisClientType, createClient } from "redis";
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
  public async pullQueue(){
    const res = await this.client.rPop("messagesFromApi" as string);
    if(res)
    return JSON.parse(res);
    return null
  }
}