import WebSocket from "ws";
import { User } from "./user";
export default class userManager{
  private allUsers:Map<string,User> = new Map();
  private allAdmin:Map<string,User> = new Map();
  private static instance:userManager;
  private constructor(){};
  public static getInstance(){
    if(this.instance)return this.instance;
    else {
      return this.instance = new userManager();
    }
  }
  public addUser(socket:WebSocket){
    const rand:string = this.getRandom();
    this.allUsers.set(rand,new User(socket,rand));
    console.log("user added ",rand);
    console.info(`users: ${userManager.getInstance().allUsers.size} admins:${userManager.getInstance().allAdmin.size}`);
  }
  public addAdmin(socket:WebSocket){
    const rand:string = this.getRandom();
    this.allAdmin.set(rand,new User(socket,rand));
    console.log("admin added ",rand);
    console.info(`users: ${userManager.getInstance().allUsers.size} admins:${userManager.getInstance().allAdmin.size}`);
  }
  public delUser(id:string){
    this.allUsers.delete(id);
  }
  public emitAdmin(msg:string){
    this.allAdmin.forEach(e=>e.sendMsg(msg));
  }
  public emitMsg(msg:string){
    this.allUsers.forEach(e=>e.sendMsg(msg));
  }
  public getRandom():string{
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}