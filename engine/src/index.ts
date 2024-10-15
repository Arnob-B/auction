import redisManager from "./utils/redisManager";
import { inputType } from "./types/in";
import { userManager } from "./utils/userManager";
import { addPlayer, addUser, banUser, getCurrentPlayer, messagesFromApiType, placeBid } from "./types/streamType";
import { sellPlayer } from "./types/streamType";
import player from "./utils/playerManager";
import { userType } from "./types/user";
import wsManager from "./utils/wsManager";

async function main() {
  await redisManager.getInstance();
  await wsManager.getInstance();
  let msg = "";
  while (true){
    const res:messagesFromApiType|null = await redisManager.getInstance().pullQueue();
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
          if (bidAmnt === player.getInstance().nextPrice) {
            if (!userManager.getInstance().isBanned(bidderId)) {
              //updating the user
              console.log("user is not in ban list");
              const user = userManager.getInstance().allUsers.find(e=>e.userId === bidderId);
              if(user){
                console.log("user is present in local db");
                player.getInstance().currentWinningBidder = bidderId;
                // updating the player 
                player.getInstance().currentPrice = bidAmnt;
                player.getInstance().nextPrice = player.getInstance().currentPrice+player.getInstance().incrementPrice;
                wsManager.getInstance().bidPlaced();
                redisManager.getInstance().publish(res.clientId,player.getInstance().showPlayer());
              }else redisManager.getInstance().publish(res.clientId,"you are not a valid user")
            }else redisManager.getInstance().publish(res.clientId,"you are banned")
          }else redisManager.getInstance().publish(res.clientId,"price is not upto the bid mark")
        }else redisManager.getInstance().publish(res.clientId,"you chose wrong player");
        break;
      case banUser:
        msg = userManager.getInstance().banUser(res.body);
        redisManager.getInstance().publish(res.clientId,msg);
        break;
      case sellPlayer:
        msg = player.getInstance().sellPlayer();
        redisManager.getInstance().publish(res.clientId,msg);
        break;
      case getCurrentPlayer:
        msg = JSON.stringify({
          id: player.getInstance().id,
          name:player.getInstance().name,
          basePrice:player.getInstance().basePrice,
          currentPrice:player.getInstance().currentPrice,
          nextBid:player.getInstance().nextPrice
        });
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