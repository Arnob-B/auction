enum msgtype{
  playerBid,
  playerSold,
}
export type storePlayerBid = {
  type:msgtype.playerBid,
  playerId: String,
  bidId: String,
}
export type playerSold = {
  type : msgtype.playerSold,
  bidId:string,
}