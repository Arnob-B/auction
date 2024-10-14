import { addPlayer, addUser, banUser, banUserBody, messagesFromApiType, sellPlayer } from "../types/streamType";
import redisManager from "../redisManager";
import { Router } from "express";
const route=Router();
route.post('/addPlayer',async(req,res)=>{
  const {id,name,basePrice} = req.body;
  if(id !==undefined && name !==undefined && basePrice !==undefined){
    const response = await redisManager.getInstance().sendAndAwait({
      type:addPlayer,
      body:{
        playerId: id,
        playerName: name,
        playerBasePrice: basePrice
      },
      clientId:redisManager.getInstance().getRandom()
    });
    res.json({ msg: response });
  }
  else{
    res.json({ msg: "failed" });
  }
});
//@ts-ignore
route.post('/banUser',async (req,res)=>{
  const { userId } = req.body;
  if (userId !== undefined) {
    const response = await redisManager.getInstance().sendAndAwait({
      type: banUser,
      body: { userId: userId },
      clientId:redisManager.getInstance().getRandom()
    });
    return res.json({ msg: response });
  }
  else res.json({ msg: "failed" });
});

//@ts-ignore
route.post("/addUser",async(req,res)=>{
  const { userId } = req.body;
  if (userId !== undefined) {
    const response = await redisManager.getInstance().sendAndAwait({
      type: addUser,
      body: { userId: userId },
      clientId:redisManager.getInstance().getRandom()
    });
    return res.json({ msg: response });
  }
  else res.json({ msg: "failed" });
});

route.post("/sellPlayer",async(req,res)=>{
  const response = await redisManager.getInstance().sendAndAwait({
    type:sellPlayer,
    clientId: redisManager.getInstance().getRandom()
  });
  res.json({msg:response});
})

export default route;