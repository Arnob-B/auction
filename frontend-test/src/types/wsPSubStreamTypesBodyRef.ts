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
    playerId: string,
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
  body: {
    playerId: string,
    bidderId: string,
    bidderName: string,
    amount: number
  }
}
export type userBanned ={
  type: "USER_BANNED",
  body: {
    userId: string,
    userName: string,
  }
}
export type getControl = {
  type: "CONTROL",
  body:{state: "START" | "STOP"}
}
export type wsPublishMsg =  newPlayerListed | bidPlaced | newBidPrice | playerSold | userBanned | getControl;