import redisManager from "./redisManager";
import express from "express"
redisManager.getInstance();
const app = express();
app.use(express.json());
app.post('/bid',async(req,res)=>{
  const {playerId, bidderId, amnt}= req.body;
  if(!playerId || !bidderId || !amnt)
  {
    const response = await redisManager.getInstance().publish({
      playerId: playerId,
      bidderId: bidderId,
      amnt: amnt
    });
    res.json({ msg: response });
  }
  else res.json({ msg: "failed" });
});
app.listen(3000, ()=>{
  console.log("application started at 3000");
});