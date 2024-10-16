import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";
import dbManager from "./utils/dbManager";


const main = async ()=>{
  dbManager.getInstance();
}
main();