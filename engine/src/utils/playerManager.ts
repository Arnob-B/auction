import { playerStat } from "../types/playerStats";

//singleton
export default class player{
  public id:string;
  public name:string;
  public basePrice:number;
  public currentPrice:number;
  public incrementPrice:number;
  public currentWinningBidder:string;
  public static instance:player;
  private constructor(){
    this.id = "";
    this.name = "";
    this.currentWinningBidder="";
    this.basePrice = 0;
    this.currentPrice = 0;
    this.incrementPrice = 0;
  }
  public static getInstance(){
    if(this.instance){
      return this.instance
    }
    return this.instance = new player();
  }
  public setPlayer(stats:playerStat):string{
    if(this.id === stats.playerId) return "player already in bid"
    this.id = stats.playerId;
    this.name = stats.playerName;
    this.basePrice = stats.playerBasePrice;
    this.currentPrice = this.basePrice;
    this.currentWinningBidder = "";
    return "new player set";
  }
  public sellPlayer(){
    return "player sold"
    //db calls
  }
  public getPlayerId(){
    return this.id;
  }
  public getCurrentPrice(){
    return this.currentPrice;
  }
  public getPlayer(){
    return this.getPlayer
  }
  public showPlayer(){
    return JSON.stringify({
      id:this.id,
      name:this.name,
      basePrice:this.basePrice,
      currentPrice:this.currentPrice,
      incrementPrice:this.incrementPrice,
      currentWinningBidder:this.currentWinningBidder
    });
  }
}