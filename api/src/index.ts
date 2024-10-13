import redisManager from "./redisManager";
import adminRoute from './routes/adminRoute'
import express from "express"
import { addPlayer, messagesFromApiType, placeBid } from "./types/streamType";
redisManager.getInstance();
const app = express();
app.use(express.json());


app.use("/admin",adminRoute);

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