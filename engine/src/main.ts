import redisManager from "./redisManager";
import { inputType } from "./types/in";

async function main() {
  await redisManager.getInstance();
  while (true){
    const res:inputType = await redisManager.getInstance().pullQueue();
    if(res)
    console.log(res);
  }
}


main();