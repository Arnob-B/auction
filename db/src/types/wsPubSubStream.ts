export const newPlayerListedType = "NEW_PLAYER_LISTED";
export const bidPlacedType = "BID_PLACED";
export const playerSoldType =  "PLAYER_SOLD";
export const userBannedType = "USER_BANNED";

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
export type playerSold = {
  type: "PLAYER_SOLD",
  body: {
    playerId: string,
    playerName:string,
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
export type dbMessageType =  newPlayerListed | bidPlaced |  playerSold | userBanned;