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
  public async playerSold(playerId: string, bidderId: string, amount: number) {
    if (bidderId === "" || playerId === "") {
      if (playerId === "") { console.warn("playerId null returning"); return; }
      //no-one bought the player
      try {
        console.log(`empty sell initiated`);
        const res = await this.client.player.update({
            where: { id: playerId },
            data: {state: playerState.SOLD}
          })
        console.log(`marked as sold`);
      }
      catch (err) {console.error(`empty player sell  error -> \n${err}\n----------`);}
      return;
    }

    //player selling transaction
    try {
      //reading the transaction
      const user = await this.client.user.findFirst({
        where: {id: bidderId},
        select: {balance: true,points: true,id: true}
      })
      const player = await this.client.player.findFirst({
        where: { id: playerId },
        select: {points: true,ownerId: true,state: true,sellingPrice: true}
      })

      if (user && player) {
        // changes;
        user.balance -= amount;
        player.sellingPrice = amount;
        user.points += player.points;
        player.ownerId = user.id;
        player.state = playerState.SOLD;
        // writing the transaction
        //any error will stop the engine
        await this.client.user.update({
          where: { id: bidderId },
          data: {balance: user.balance,points: user.points}
        });
        console.log("user updated successfully");
        await this.client.player.update(
          {where: { id: playerId },
            data: {sellingPrice: player.sellingPrice,ownerId: player.ownerId,state: player.state}}
        )
        console.log("player updated successfully");
      }
      else {
        throw "did not get user and player with their ID"
      }
    }
    catch (err) {
      console.error(`error while reading -> \n${err}\n----------`);
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