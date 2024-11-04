import { bidPlacedType, dbMessageType, newPlayerListedType, playerSoldType, userBannedType } from "./types/wsPubSubStream";
import dbManager from "./utils/dbManager";
import { createClient } from "redis";
import dotenv from "dotenv"
dotenv.config()

const main = async () => {
  await dbManager.getInstance();
  const client = createClient({
  //@ts-ignore
    url:process.env.CLIENT_URL
  });
  await client.connect();
  console.log("REDIS client setup done");
  while (true) {
    console.log("----awaiting----");
    const msg = await client.brPop("DBMESSAGE" as string,0);
    if (msg && msg.key === "DBMESSAGE") {
      const res:dbMessageType = JSON.parse(msg.element);
      console.info(res.type);
      switch (res.type) {
        case newPlayerListedType: {
          await dbManager.getInstance().playerListed(res.body.playerId);
          break;
        }
        case bidPlacedType: {
          await dbManager.getInstance().storeBid(res.body.playerId, res.body.bidderId, res.body.amount);
          break;
        }
        case playerSoldType: {
          await dbManager.getInstance().playerSold(res.body.playerId, res.body.bidderId, res.body.amount);
          break;
        }
        case userBannedType: {
          console.log(res.body);
          await dbManager.getInstance().banUser(res.body.userId);
          break;
        }
    }
    }
  }
}
main();