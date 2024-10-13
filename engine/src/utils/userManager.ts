import { banUserBody } from "../types/streamType";
import { userType } from "../types/user";

export class userManager{
  public allUsers:Array<userType>;
  public bannedUser:Array<string>;
  private static instance:userManager;
  private constructor(){
    this.allUsers = [];
    this.bannedUser = [];
  }
  public static getInstance(): userManager {
    if (this.instance)
      return this.instance;
    else {
       this.instance = new userManager();
       return this.instance;
    }
  }
  public addUser(userDetails:userType){
    if(!this.allUsers.find(e=>e.userId === userDetails.userId))
    {
    this.allUsers.push(userDetails);
    console.log("new user added");
    }
  }
  public banUser(userDetails:banUserBody){
    if(!this.bannedUser.find(e=> e===userDetails.userId))
    this.bannedUser.push(userDetails.userId);
  }
  public isBanned(id:string):boolean{
    return this.bannedUser.find(e=> e===id) ? true:false;
  }
}