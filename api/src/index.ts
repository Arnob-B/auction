import redisManager from "./redisManager";
import express from "express"
redisManager.getInstance();
const app = express();
app.use(express.json());
app.post('/bid',async(req,res)=>{
  console.log();
  const {playerId, bidderId, amnt}= req.body;
  const response = await redisManager.getInstance().publish({
    playerId:playerId,
    bidderId:bidderId,
    amnt:amnt
  });
  res.json({msg:response});
});
app.listen(3000, ()=>{
  console.log("application started at 3000");
});