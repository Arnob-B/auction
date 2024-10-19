import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";
import dbManager from "./utils/dbManager";
import { userList } from "./seeding/users";

const seeding=async ()=>{
  const client = new PrismaClient();
  const res = await client.user.count();
  if( res < 200){
    for (let a of userList) {
      console.log("pushing");
      await client.user.create({
        data: {
          id: a.userId,
          name: a.name,
          password: a.password,
          balance: 500
        }
      });
    }
  }
}

const main = async ()=>{
  await seeding();
}
main();