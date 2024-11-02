import { banUserBody } from "../types/streamType";
import { userType } from "../types/user";
export class user{
  private id:string
  private name:string
  private balance:number;
  private playerCount:number;
  constructor(userId:string,userName:string,balance:number, playerCount :number){
    this.id = userId;
    this.name = userName;
    this.balance = balance;
    this.playerCount = playerCount;
  }
  getDetails(){
    return {
      userId:this.id,
      userName:this.name,
      balance :this.balance,
      playerCount:this.playerCount
    }
  }
  setBalance(bal:number){this.balance = bal;}
  incrementPlayerCount(){
    this.playerCount++;
    return true;
  }
};
export class userManager{
  public allUsers:Array<user>; 
  public bannedUser:Array<string>; // contains all the banned users
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
  public addUser(userId:string,userName:string,balance:number,playerCount:number){
    if(!this.allUsers.find(e=>e.getDetails().userId === userId))
    {
      this.allUsers.push(new user(userId,userName,balance,playerCount));
      return "new user added";
    }
    return "user already present"
  }
  public banUser(userId:string){
    if(!this.bannedUser.find(e=> e===userId))
    {
      this.bannedUser.push(userId);
      return "userBanned"
    }
    return "userAlreadyInBanList"
  }
  public isBanned(id:string):boolean{
    return this.bannedUser.find(e=> e===id) ? true:false;
  }
}