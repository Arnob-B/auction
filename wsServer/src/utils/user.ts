import WebSocket from "ws";
import { engineMessage, publish } from "../types/engineMessage";
import userManager from "./userManager";
export class User{
  private id:string;
  private ws:WebSocket;
  public constructor(socket:WebSocket,id:string){
    this.ws = socket;
    this.id = id;
    this.listener();
  }
  public sendMsg(msg:any){
    this.ws.send(JSON.stringify(msg));
  }
  public listener(){
    this.ws.on('message',(message)=>{
      const msg:engineMessage = JSON.parse(message.toString());
      if(msg.type === publish)
      {userManager.getInstance().emitMsg(msg);}
    })
    this.ws.on("close",(message)=>{
      console.log(`${this.id} closed`);
    })
  }
}