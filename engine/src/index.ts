import redisManager from "./utils/redisManager";
import { inputType } from "./types/in";
import { userManager } from "./utils/userManager";
import {addPlayerType,banUserType,placeBidType} from "./types/streamType"

async function main() {
  await redisManager.getInstance();
  while (true){
    const res:addPlayerType| banUserType| placeBidType = await redisManager.getInstance().pullQueue();
  }
}

main();