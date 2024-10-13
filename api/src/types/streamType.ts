export const addPlayer = "ADD_PLAYER";
export type addPlayerBody = {
  playerId:string;
  playerName:string;
  playerBasePrice:number;
}
export const addUser = "ADD_USER";
export type addUserBody = {
  userId:string,
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
export type messagesFromApiType = {
  type : typeof addPlayer,
  body : addPlayerBody
} | {
  type: typeof addUser,
  body: addUserBody
}
 | {
  type: typeof banUser,
  body: banUserBody
}| {
  type: typeof placeBid,
  body: placeBidBody
};