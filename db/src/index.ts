import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";
import dbManager from "./utils/dbManager";
import { userList } from "./seeding/users";
import playersList from "./seeding/finalPlayerList";

const userSeeding=async ()=>{
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

const playerSeeding = async ()=>{
  const obj = JSON.parse(playersList);
  const client = new PrismaClient();
  console.log("checking DB");
  const res = await client.player.count();
  if( res < 500){
    for (let a of obj) {
      console.log("pushing");
      await client.player.create({
        data:{
          id:a.ID.toString(),
          name:a.Name,
          basePrice:a.Price,
          ownerId: "admin"
        }
      });
    }
  }
}

const main = async ()=>{
  await userSeeding();
  await playerSeeding();
}
main();
