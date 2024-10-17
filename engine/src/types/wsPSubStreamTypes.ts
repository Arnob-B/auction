export type newPlayerListed = {
  type:"NEW_PLAYER_LISTED",
  body:{
    playerId:string,
    playerName: string,
    basePrice: number,
    currentPrice: number,
  }
}
export type bidPlaced = {
  type: "BID_PLACED",
  body: {
    palyerId: string,
    bidderId: string,
    bidderName: string,
    amount: number,
    nextPrice: number
  }
}
export type newBidPrice = {
      type: "NEW_BID_PRICE",
      body: {
        playerId: string,
        nextPrice: number
      }
    }

export type playerSold = {
      type: "PLAYER_SOLD",
      playerId: string,
      bidderId: string,
      bidderName: string,
      amount: number
    }
export type userBanned ={
  type: "USER_BANNED",
  userId: string,
  userName: string,
}
export type getControl = {
  type: "CONTROL",
  state: "START" | "STOP"
}
export type wsPublishMsg =  newPlayerListed | bidPlaced | newBidPrice | playerSold | userBanned | getControl;