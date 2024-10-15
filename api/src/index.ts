import redisManager from "./redisManager";
import adminRoute from './routes/adminRoute'
import express from "express"
const cors = require('cors')
import { addPlayer, getCurrentPlayer, messagesFromApiType, placeBid } from "./types/streamType";
redisManager.getInstance();
const app = express();
app.use(express.json());


const corsOption = {
  origin: '*', // Allow only your Next.js app
  methods: ['GET', 'POST'], // Specify allowed methods
  allowedHeaders: ['Content-Type'], // Specify allowed headers
}
app.use(cors(corsOption));
app.use("/admin",adminRoute);
app.get("/getCurrentPlayer",async (req, res)=>{
  const response = await redisManager.getInstance().sendAndAwait({
    type: getCurrentPlayer,
    clientId: redisManager.getInstance().getRandom()
  });
  res.json({msg:JSON.parse(response)});
})

app.post('/bid',async(req,res)=>{
  console.log(req.body);
  const {playerId, bidderId, amnt}= req.body;
  if(playerId !==undefined && bidderId !== undefined && amnt !== undefined)
  {
    const response = await redisManager.getInstance().sendAndAwait({
      type:placeBid,
      body: {
        playerId: playerId,
        bidderId: bidderId,
        bidAmnt: amnt
      },
      clientId:redisManager.getInstance().getRandom()
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