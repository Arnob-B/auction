import { playerStat } from "../types/playerStats";
import { userManager } from "./userManager";

//singleton
export default class player{
  public id:string;
  public name:string;
  public basePrice:number;
  public currentPrice:number;
  public incrementPrice:number;
  public currentWinningBidder:string;
  public nextPrice:number;
  public static instance:player;
  private constructor(){
    this.id = "";
    this.name = "";
    this.currentWinningBidder="";
    this.basePrice = 0;
    this.currentPrice = 0;
    this.incrementPrice = 0;
    this.nextPrice = this.currentPrice+ this.incrementPrice;
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
    this.nextPrice = this.currentPrice+ this.incrementPrice;
    return "new player set";
  }
  public sellPlayer(){
    const winnerId = this.currentWinningBidder;
    if( winnerId === ""){
      //db call with player remaining unsold
    }
    else{
      const ind = userManager.getInstance().allUsers.findIndex(e=> e.userId === winnerId);
      userManager.getInstance().allUsers[ind].amnt-= this.currentPrice;
      //db call to update player profile
    }
    return "player sold"
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