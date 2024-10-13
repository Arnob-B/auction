import { playerStat } from "./types/playerStats";

//singleton
export default class player{
  private id:string;
  private name:string;
  private basePrice:number;
  private currentPrice:number;
  private currentWinningBidder:string;
  private static instance:player;
  private constructor(){
    this.id = "";
    this.name = "";
    this.currentWinningBidder="";
    this.basePrice = 0;
    this.currentPrice = 0;
  }
  public static getInstance(){
    if(this.instance){
      return this.instance
    }
    return this.instance = new player();
  }
  public setPlayer(stats:playerStat){
    this.id = stats.playerId;
    this.name = stats.playerName;
    this.basePrice = stats.playerBasePrice;
    this.currentPrice = this.basePrice;
    this.currentWinningBidder = "";
  }
  public sellPlayer(){
  }
}