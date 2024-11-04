import WebSocket from "ws";
export class User{
  private id:string;
  private ws:WebSocket;
  public constructor(socket:WebSocket,id:string){
    this.ws = socket;
    this.id = id;
  }
  public sendMsg(msg:string){
    this.ws.send(msg);
  }
}