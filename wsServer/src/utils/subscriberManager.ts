import { createClient, RedisClientType } from "redis";
import userManager from "./userManager";
import { bidPlacedType, getControlType, newBidPriceType, newPlayerListedType, playerSoldType, userBannedType, wsPublishMsg } from "../types/wsPSubStreamTypes";
import dotenv from "dotenv"
dotenv.config();

export default class subscriberManager{
  private subscriber:RedisClientType;
  private static instance:subscriberManager;
  private constructor(){
    console.log(process.env.SUBCRIBER_URL);
    console.log("subcriberManager started");
    this.subscriber = createClient({
      url:process.env.SUBCRIBER_URL
    });
    this.subscriber.connect();
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
  public async run(){
    await this.subscriber;
    console.log("waiting to recieve msgs");
    this.subscriber.subscribe("WSMESSAGE",this.callbackFunc);
  }
  public async callbackFunc(message:string){
    console.log("msgRecieved");
    const msg:wsPublishMsg = JSON.parse(message);
    switch(msg.type){
      case newPlayerListedType:{
        await userManager.getInstance().emitAdmin(JSON.stringify(msg));
        await userManager.getInstance().emitMsg(JSON.stringify(msg));
        break;
      }
      case bidPlacedType:{
        const {bidderId, ...sanitizedBody} = msg.body;
        await userManager.getInstance().emitAdmin(JSON.stringify(msg));
        await userManager.getInstance().emitMsg(JSON.stringify({
          type:bidPlacedType,
          body:sanitizedBody
        }));
        break;
      }
      case newBidPriceType:{
        await userManager.getInstance().emitAdmin(JSON.stringify(msg));
        await userManager.getInstance().emitMsg(JSON.stringify(msg));
        break;
      }
      case playerSoldType:{
        const {bidderId, ...sanitizedBody}= msg.body;
        await userManager.getInstance().emitAdmin(JSON.stringify(msg));
        await userManager.getInstance().emitMsg(JSON.stringify({
          type:playerSoldType,
          body:sanitizedBody
        }));
        break;
      }
      case userBannedType:{
        const {userId, ...sanitizedBody}= msg.body;
        await userManager.getInstance().emitAdmin(JSON.stringify(msg));
        await userManager.getInstance().emitMsg(JSON.stringify({
          type:userBannedType,
          body:sanitizedBody
        }));
        break;
      }
      case getControlType:{
        await userManager.getInstance().emitAdmin(JSON.stringify(msg));
        await userManager.getInstance().emitMsg(JSON.stringify(msg));
        break;
      }
    }
  }
}