import { addPlayer, addPlayerBody, banUser, changeNextPrice, control, getCurrentPlayer, messagesFromApiType, placeBid, sellPlayer } from "../types/streamType";
import player from "./playerManager";
import redisManager from "./redisManager";
import { userManager } from "./userManager";
import wsManager from "./wsManager";

export class engineManager{
  private static instance:engineManager;
  private bidContinue:boolean;
  private constructor(){
    redisManager.getInstance();
    userManager.getInstance();
    player.getInstance();
    this.bidContinue = true;
  }
  public async publishToApi(clientId:string,msg:string){
    await redisManager.getInstance().publish(clientId,msg);
  }
  public static getInstance(){
    if(this.instance) return this.instance;
    return this.instance = new engineManager();
  }
  public descisionMaker(msg:messagesFromApiType){
    switch(msg.type){
      case getCurrentPlayer:
        break;
      case addPlayer:
        break;
      case placeBid:
        break;
      case banUser:
        break;
      case sellPlayer:
        break;
      case control:
        break;
      case changeNextPrice:
        break;
    }
  }
  public getCurrentPlayer():string{
    return JSON.stringify({
      id: player.getInstance().id,
      name: player.getInstance().name,
      basePrice: player.getInstance().basePrice,
      currentPrice: player.getInstance().currentPrice,
      nextBid: player.getInstance().nextPrice
    });
  }
  public async listPlayer(body:addPlayerBody) {
    const msg = player.getInstance().setPlayer(body);
    //db call
    return msg;
  }
  public async placeBid(){

  }
  public async changeNextPrice(){

  }
  public async sellPlayer(){
  }
  public async banUser(body:{userId:string}){
    const msg = userManager.getInstance().banUser(body.userId);
  }
  public async controls(body:{state:string}){
    let msg = "";
    if(body.state === "START")
    {
      this.bidContinue = true;
      msg = "bidding started";
    }
    else if(body.state === "STOP")
    {
      this.bidContinue = false;
      msg = "bidding stopped";
    }
    redisManager.getInstance().publish('WsPubSub',JSON.stringify(
      {
        type: "CONTROL",
        state:body.state
      }
    ));
  }
}