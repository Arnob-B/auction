export const publish = "PUBLISH";
export const bidClosed = "BID_CLOSED"
export const bidPlace = "BID_PLACE"
export type BIDPLACE = {
  type : typeof publish,
  cat : typeof bidPlace,
  playerId:string,
  bidderId:string,
  currentPrice :number,
  nextPrice :number
}
export type BIDCLOSE = {
  type : typeof publish,
  cat : typeof bidClosed,
  playerId:string,
  winningBidderId:string,
  currentPrice :number,
}
export type engineMessage= BIDPLACE | BIDPLACE;