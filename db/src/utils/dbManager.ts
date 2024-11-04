import { PrismaClient ,playerState} from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
export default class dbManager{
  private client :PrismaClient;
  private  static instance : dbManager;
  private constructor(){
    this.client = new PrismaClient();
  }
  public static getInstance(){
    if(this.instance) return this.instance
    else return this.instance = new dbManager();
  }
  public async  playerListed(playerId:string){
    try{
      const res = await this.client.player.update(
        {
          where: { id: playerId },
          data: {
            state: playerState.LISTED
          }
        }
      )
      console.log("list success");
    }
    catch(err){
      console.error(`player listing error -> \n${err}\n----------`);
    }
  }
  public async playerSold(playerId:string,bidderId:string, amount:number){
    if (bidderId === "" || playerId === "") {
      if (playerId === "") {console.warn("playerId null returning");return;}
      try {
        console.log(`empty sell initiated`);
        const res = await this.client.player.update(
          {
            where: { id: playerId },
            data: {
              state: playerState.SOLD
            }
          }
        )
        console.log(`marked as sold`);
      }
      catch (err) {
        console.error(`empty player sell  error -> \n${err}\n----------`);
      } return;
    }
    let userBalance = null
    try{
      userBalance = await this.client.user.findFirst({
        where: {
          id: bidderId
        },
        select: {
          balance: true
        }
      });
      console.log("bal withdraw success");
    } catch (err) {
      console.error(`player balance withdrawal error -> \n${err}\n----------`);
    }
    if (userBalance !==null) {
      try {
        await this.client.user.update({
          where: { id: bidderId },
          data: {
            balance: userBalance.balance - amount
          }
        })
        console.info(`user balanced reducted`);
      }
      catch (err) {
        console.error(`user bal reduction error -> \n${err}\n----------`);
      }
      try {
        await this.client.player.update(
          {
            where: { id: playerId },
            data: {
              ownerId: bidderId,
              state: playerState.SOLD
            }
          }
        )
        console.info("player sold");
      } catch (err) {
        console.error(`player owner & state update error -> \n${err}\n----------`);
      }
  }
  else {
    console.warn("balance is still null");
  }
}
  public async storeBid(playerId:string,bidderId:string,amount:number){
    try {
      const res = await this.client.bids.create({
        data: {
          playerId: playerId,
          bidderId: bidderId,
          amount: amount
        }
      });
      console.log(`bid ${res.bidId} stored`);
    }catch(err){
        console.error(`bid store error -> \n${err}\n----------`);
    }
  }
  public async banUser(userId:string){
    try {
      await this.client.user.update({
        where: {
          id: userId
        },
        data: {
          isBanned: true
        }
      });
      console.log(`${userId} banned`);
    }catch(err){
        console.error(`ban user error -> \n${err}\n----------`);
    }
  }
};