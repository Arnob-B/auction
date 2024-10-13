import redisManager from "./utils/redisManager";
import { inputType } from "./types/in";
import { userManager } from "./utils/userManager";
import { addPlayer, addUser, banUser, messagesFromApiType, placeBid } from "./types/streamType";

async function main() {
  await redisManager.getInstance();
  while (true){
    const res:messagesFromApiType = await redisManager.getInstance().pullQueue();
    if(res)
    switch(res.type){
      case addUser:
        console.log("adding user");
        console.log(res.body);
        break;
      case banUser:
        console.log("adding user");
        console.log(res.body);
        break;
      case placeBid:
        console.log("bidding");
        console.log(res.body);
        break;
      case addPlayer:
        console.log("ban User");
        console.log(res.body);
        break;
      default:
        console.log("unkown behaviour");
        console.log(res);
    }
  }
}

main();