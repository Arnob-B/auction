import { PrismaClient } from "@prisma/client";
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
  public playerListed(playerId:string){
    this.client.player.update(
      {
        where:{id:playerId},
        data:{
          isListed :true
        }
      }
    )
  }
  public async playerSold(playerId:string,bidderId:string, amount:number){
    const userBalance = await this.client.user.findFirst({
      where:{
        id:bidderId
      },
      select:{
        balance:true
      }
    });
    if (userBalance) {
      await this.client.player.update(
        {
          where: { id: playerId },
          data: {
            ownerId: bidderId
          }
        }
      )
      await this.client.user.update({
        where: { id: bidderId },
        data: {
          balance: userBalance.balance - amount
        }
      })
    }
  }
  public async storeBid(playerId:string,bidderId:string,amount:number){
    await this.client.bids.create({
      data:{
        playerId:playerId,
        bidderId:bidderId,
        amount:amount
      }
    });
  }
  public async banUser(){
  }
};