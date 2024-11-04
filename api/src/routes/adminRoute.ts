import { addPlayer, addUser, banUser, banUserBody, messagesFromApiType, sellPlayer } from "../types/streamType";
import redisManager from "../redisManager";
import { Router } from "express";
import { changeNextPrice } from "../types/streamType";
import { setControl } from "../types/streamType";
const route=Router();

route.post('/addPlayer',async(req,res)=>{
  console.info("ADD PLAYER");
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
    console.warn(`${id}|${name}|${basePrice}`);
    res.json({ msg: "failed" });
  }
});
//@ts-ignore
route.post('/banUser',async (req,res)=>{
  console.info('BANUSER');
  const { userId } = req.body;
  if (userId !== undefined) {
    const response = await redisManager.getInstance().sendAndAwait({
      type: banUser,
      body: { userId: userId },
      clientId:redisManager.getInstance().getRandom()
    });
    return res.json({ msg: response });
  }
  else {
    console.warn(`${userId}`);
    res.json({ msg: "failed" });
  }
});

//@ts-ignore
route.post("/addUser",async(req,res)=>{
  const { userId,userName,balance} = req.body;
  if (userId !== undefined && userName !==undefined && balance !==undefined) {
    const response = await redisManager.getInstance().sendAndAwait({
      type: addUser,
      body: { userId: userId ,userName:userName,balance:balance},
      clientId:redisManager.getInstance().getRandom()
    });
    return res.json({ msg: response });
  }
  else res.json({ msg: "failed" });
});

route.post("/sellPlayer",async(req,res)=>{
  console.info("SELLPLAYER");
  const response = await redisManager.getInstance().sendAndAwait({
    type:sellPlayer,
    clientId: redisManager.getInstance().getRandom()
  });
  res.json({msg:response});
})

route.post("/changeNextPrice",async(req,res)=>{
  console.info("CHANGENEXTPRICE");
  if(typeof(req.body.incrementPrice) === "number")
  {
    const response = await redisManager.getInstance().sendAndAwait({
      type: changeNextPrice,
      body: { incrementPrice: req.body.incrementPrice },
      clientId: redisManager.getInstance().getRandom()
    })
    res.json({ msg: response });
  }
  else {
    console.warn(`${req.body.incrementPrice}`);
    res.json({msg:"failed"});
  }
});
route.post("/controls",async(req,res)=>{
  console.info("CONTROL");
  if(req.body.state === "START" || req.body.state === "STOP") {
    const response = await redisManager.getInstance().sendAndAwait({
      type: setControl,
      body: {
        state: req.body.state
      },
      clientId: redisManager.getInstance().getRandom()
    })
    res.json({ msg: response });
  }
  else{
    console.warn(`${req.body.state}`);
    res.json({ msg: "failed" });
  }
});

export default route;