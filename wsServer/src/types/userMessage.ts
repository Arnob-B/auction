export const subscribe = "SUBSCRIBE"
export const unsubscribe = "UNSUBSCRIBE"


export type incomingMsg = {
  type:typeof subscribe| typeof unsubscribe
}