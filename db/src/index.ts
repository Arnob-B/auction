import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";
import dbManager from "./utils/dbManager";


const main = async ()=>{
  dbManager.getInstance().sellPlayer("player2","user1",200);
}
main();