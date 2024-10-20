import { RedisClientType, createClient } from "redis";
import { addPlayerBody, messagesFromApiType } from "./types/streamType";
import dotenv from "dotenv"
dotenv.config();
export default class redisManager{
  private subscriber:RedisClientType; 
  private client:RedisClientType;
  private static instance: redisManager ;
  private initiated:boolean;
  private constructor(){
    console.log("redis Manager instialization started");
    this.subscriber = createClient({
      url:process.env.SUBSCRIBER_URL
    });
    this.client = createClient({
      url:process.env.CLIENT_URL
    });
    this.subscriber.connect();
    this.client.connect();
    this.initiated = false;
    this.init();
  }
  public async init(){
    await this.subscriber;
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
  public async sendAndAwait({ type, body ,clientId}: messagesFromApiType): Promise<string> {
    return new Promise(async (resolve)=>{
      try {
        this.subscriber.subscribe(clientId, (message) => {
          this.subscriber.unsubscribe(clientId);
          resolve(message);
        });
        await this.client.lPush("messagesFromApi", JSON.stringify({
          type: type,
          body: body,
          clientId:clientId
        }));
      }
      catch (err) {
        console.log(err);
        resolve("failed");
        return;
      }
    })
  }
  public getRandom(){
    const rand =  Math.random().toString(36).substring(2,);
    console.log(rand)
    return rand;
  }

};