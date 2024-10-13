import redisManager from "./redisManager";
import express from "express"
import { addPlayer, messagesFromApiType, placeBid } from "./types/streamType";
redisManager.getInstance();
const app = express();
app.use(express.json());
app.post('/addPlayer',async(req,res)=>{
  const {id,name,basePrice} = req.body;
  if(id !==undefined && name !==undefined && basePrice !==undefined){
    const response = await redisManager.getInstance().publish({
      type:addPlayer,
      body:{
        playerId: id,
        playerName: name,
        playerBasePrice: basePrice
      }
    });
    res.json({ msg: response });
  }
  else{
    res.json({ msg: "failed" });
  }
})
app.post('/bid',async(req,res)=>{
  const {type,playerId, bidderId, amnt}= req.body;
  if(type !== undefined && playerId !==undefined && bidderId !== undefined && amnt !== undefined)
  {
    const response = await redisManager.getInstance().publish({
      type:type,
      body: {
        playerId: playerId,
        bidderId: bidderId,
        bidAmnt: amnt
      }
    });
    res.json({ msg: response });
  }
  else {
    res.json({ msg: "failed" });
}
});
app.listen(3000, ()=>{
  console.log("application started at 3000");
});