export const publish = "PUBLISH";
export type engineMessage = {
  type : typeof publish,
  body : string
}