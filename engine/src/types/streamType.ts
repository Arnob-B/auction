export const addPlayer = "ADD_PLAYER";
export type addPlayerBody = {
  playerId:string;
  playerName:string;
  playerBasePrice:number;
}
export const addUser = "ADD_USER";
export type addUserBody = {
  userId:string,
  userName:string,
  balance:number,
}
export const banUser = "BAN_USER";
export type banUserBody = {
  userId:string
}
export const placeBid = "PLACE_BID";
export type placeBidBody = {
  playerId: string,
  bidderId: string,
  bidAmnt: number
}
export const control = "CONTROL";
export type controlBody = {
  state: "START"|"STOP"
}

export const changeNextPrice = "CHANGE_NEXT_PRICE";
export type changeNextPriceBody = {
  incrementPrice:number
}

export const getCurrentPlayer = "GET_CURRENT_PLAYER"

export const sellPlayer = "SELL_PLAYER";
export type messagesFromApiType = {
  type : typeof addPlayer,
  body : addPlayerBody,
  clientId:string
} | {
  type: typeof addUser,
  body: addUserBody
  clientId:string
}
 | {
  type: typeof banUser,
  body: banUserBody
  clientId:string
}| {
  type: typeof placeBid,
  body: placeBidBody
  clientId:string
}|{
  type:typeof sellPlayer,
  body?:string
  clientId:string
}|{
  type:typeof getCurrentPlayer,
  body?:string,
  clientId:string,
}|{
  type:typeof control,
  body?:string,
  clientId:string
}|{
  type:typeof changeNextPrice,
  body:changeNextPriceBody,
  clientId:string
};