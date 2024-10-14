import redisManager from "./utils/redisManager";
import { inputType } from "./types/in";
import { userManager } from "./utils/userManager";
import { addPlayer, addUser, banUser, messagesFromApiType, placeBid } from "./types/streamType";
import { sellPlayer } from "./types/streamType";
import player from "./utils/playerManager";
import { userType } from "./types/user";

async function main() {
  await redisManager.getInstance();
  let msg = "";
  while (true){
    const res:messagesFromApiType = await redisManager.getInstance().pullQueue();
    if(res)
    switch(res.type){
      case addUser:
        msg = userManager.getInstance().addUser({userId:res.body.userId, amnt:5000});
        redisManager.getInstance().publish(res.clientId,msg);
        break;
      case addPlayer:
        msg = player.getInstance().setPlayer(res.body);
        redisManager.getInstance().publish(res.clientId,msg);
        break;
      case placeBid:
        const {playerId, bidderId, bidAmnt} = res.body ;
        console.log("initial req ->",playerId, bidderId, bidAmnt);
        if (player.getInstance().getPlayerId() === playerId) {
          console.log("player is present");
          if (bidAmnt >= player.getInstance().getCurrentPrice() + player.getInstance().incrementPrice) {
            console.log("amount set is greater than base price");
            if (!userManager.getInstance().isBanned(bidderId)) {
              //updating the user
              console.log("user is not in ban list");
              const user = userManager.getInstance().allUsers.find(e=>e.userId === bidderId);
              if(user){
                console.log("user is present in local db");
                user.amnt -= bidAmnt;
                player.getInstance().currentWinningBidder = bidderId;
                // updating the player 
                const newPrice = player.getInstance().currentPrice = bidAmnt;
                console.log("new Price set ", newPrice);
                player.getInstance().showPlayer()
                redisManager.getInstance().publish(res.clientId,player.getInstance().showPlayer());
              }
            }
          }
        }
        break;
      case banUser:
        msg = userManager.getInstance().banUser(res.body);
        redisManager.getInstance().publish(res.clientId,msg);
        break;
      case sellPlayer:
        msg = player.getInstance().sellPlayer();
        redisManager.getInstance().publish(res.clientId,msg);
        break;
      default:
        console.log("unkown behaviour");
        redisManager.getInstance().publish("garbage","give something usefull");
        console.log(res);
    }
  }
}

main();