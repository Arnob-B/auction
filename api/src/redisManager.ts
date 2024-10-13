import { RedisClientType, createClient } from "redis";
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
  public async publish({playerId,bidderId, amnt}:{
    playerId:string,
    bidderId:string,
    amnt:number
  }):Promise<string>{
    try {
      await this.publisher.lPush("bid", JSON.stringify({
        playerId: playerId,
        bidderId: bidderId,
        amnt: amnt
      }));
      return "success";
    }
    catch (err) {
      console.log(err);
      return "failed";
    }
  }
};