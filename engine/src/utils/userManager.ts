import { userType } from "../types/user";

export class userManager{
  private allUsers:Array<userType>;
  private bannedUser:Array<userType>;
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
    this.allUsers.push(userDetails);
  }
  public banUser(userDetails:userType){
    this.bannedUser.push(userDetails);
  }
  public isBanned(id:string):boolean{
    return this.bannedUser.find(e=>e.userId===id) ? true:false;
  }
  public getUser(id:string):userType|undefined{
    return this.allUsers.find(e => e.userId === id);
  }
}