import { addPlayer, addPlayerBody, banUser, changeNextPrice, changeNextPriceBody, control, getCurrentPlayer, messagesFromApiType, placeBid, placeBidBody, sellPlayer } from "../types/streamType";
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
  public async descisionMaker(msg:messagesFromApiType){
    let response = "";
    switch(msg.type){
      case getCurrentPlayer:
        {
          const response = this.getCurrentPlayer();
          this.publishToApi(msg.clientId, response);
          break;
        }
      case addPlayer:
        {
          const response = await this.listPlayer(msg.body);
          break;
        }
      case placeBid:
        {
          const response = await this.placeBid(msg.body);
          break;
        }
      case banUser:
        {
          const response = await this.banUser(msg.body);
          break;
        }
      case sellPlayer:
        {
          const response = await this.sellPlayer();
          break;
        }
      case control:
        {
          const response = await this.controls(msg.body);
          break;
        }
      case changeNextPrice:
        {
          const response =  this.changeNextPrice(msg.body);
          break;
        }
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
  public async listPlayer(body:addPlayerBody):Promise<string>{
    const msg = player.getInstance().setPlayer(body);
    //db call
    return msg;
  }
  public async placeBid(body:placeBidBody):Promise<string>{
    const { playerId, bidderId, bidAmnt } = body;
    if (player.getInstance().getPlayerId() === playerId) {
      if (bidAmnt === player.getInstance().nextPrice) {
        if (!userManager.getInstance().isBanned(bidderId)) {
          const user = userManager.getInstance().allUsers.find(e => e.getDetails().userId === bidderId);
          if (user) {
            if (bidderId === player.getInstance().currentWinningBidder) return "you are the current winning bidder";
            if (user.getDetails().balance < bidAmnt) return  "you dont have sufficient money";
            else {
              player.getInstance().currentWinningBidder = bidderId;
              // updating the player 
              player.getInstance().currentPrice = bidAmnt;
              player.getInstance().nextPrice = player.getInstance().currentPrice + player.getInstance().incrementPrice;
              // db queue push
              wsManager.getInstance().bidPlaced();
              return "bid placed";
            }
          } else return "you are not registered for the auction";
        } else return "you are banned";
      } else return "price is not upto the bid mark";
    } else return "you chose wrong player";
  }
  public changeNextPrice(body:changeNextPriceBody){
  }
  public async sellPlayer(){
    const winnerId = player.getInstance().currentWinningBidder;
    if( winnerId === ""){
      //db call with player remaining unsold
    }
    else{
      const ind = userManager.getInstance().allUsers.findIndex(e=> e.getDetails().userId === winnerId);
      let bal = userManager.getInstance().allUsers[ind].getDetails().balance;
      userManager.getInstance().allUsers[ind].setBalance(bal - player.getInstance().currentPrice);
      //db call to update player profile
    }
    return "playerSold";
  }
  public async banUser(body:{userId:string}){
    const msg = userManager.getInstance().banUser(body.userId);
    //db call
    return msg;
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