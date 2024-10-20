import WebSocket from "ws";
import userManager from "./userManager";
export class User{
  private id:string;
  private ws:WebSocket;
  public constructor(socket:WebSocket,id:string){
    this.ws = socket;
    this.id = id;
    this.listener();
  }
  public sendMsg(msg:string){
    this.ws.send(msg);
  }
  public listener(){
    this.ws.on("close",(message)=>{
      console.log(`${this.id} closed`);
    })
  }
}