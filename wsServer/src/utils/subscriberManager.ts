import { createClient, RedisClientType } from "redis";
import userManager from "./userManager";

export default class subscriberManager{
  private subscriber:RedisClientType;
  private static instance:subscriberManager;
  private constructor(){
    console.log("subcriberManager started");
    this.subscriber = createClient();
    this.init();
  }
  private async init(){
    await this.subscriber;
    console.log("subscriber is ready to recieve messsages");
  }
  public static getInstance(){
    if(this.instance)return this.instance;
    else {
      return this.instance = new subscriberManager();
    }
  }
  public run(){
    this.subscriber.subscribe("WSMESSAGE",this.callbackFunc);
  }
  public callbackFunc(message:string){
    userManager.getInstance().emitMsg(message);
  }
}