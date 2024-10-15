import WebSocket from "ws";
import player from "./playerManager";
import { bidPlace, BIDPLACE, engineMessage, publish } from "../types/webSocketOut";
export default class wsManager{
  private wsClient:WebSocket
  private static instance: wsManager ;
  private initiated:boolean;
  private constructor(){
    console.log("webSocket Manager instialization started");
    this.initiated = false;
    this.wsClient = new WebSocket('http:localhost:3002/');
    this.wsClient.addEventListener("open",()=>{
      this.init();
    });
  }
  public async init(){
    console.log("webSocket Manager instialization completed");
    this.initiated=true;
  }
  public static getInstance(): wsManager {
    if (this.instance)
      return this.instance;
    else {
       this.instance = new wsManager();
       return this.instance;
    }
  }
  public bidPlaced(){
    const msg:BIDPLACE = { 
      type:publish,
      cat:bidPlace,
      playerId: player.getInstance().id,
      bidderId: player.getInstance().currentWinningBidder,
      currentPrice: player.getInstance().currentPrice,
      nextPrice: player.getInstance().nextPrice,
    }
    this.wsClient.send(JSON.stringify(msg));
  }
}