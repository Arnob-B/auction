export type addPlayerType = {
  playerId:string;
  playerName:string;
  playerBasePrice:number;
}
export type addUserType = {
  userId:string,
}
export type banUserType = {
  userId:string
}
export type placeBidType = {
  playerId: string,
  bidderId: string,
  bidAmnt: number
}