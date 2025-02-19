import { WebSocketServer } from "ws";
import express from "express"
import userManager from "./utils/userManager";
import subscriberManager from "./utils/subscriberManager";
const app = express();
const app2 = express();
const userServer = app.listen(3002,()=>{
  console.log("WS server started on port",3002);
});

const adminServer = app2.listen(3003,()=>{
  console.log("WS server started on port",3003);
});
const wss = new WebSocketServer({server:userServer});
const adminWss = new WebSocketServer({server:adminServer});

wss.on('connection', socket => {
  userManager.getInstance().addUser(socket);
});

adminWss.on('connection',socket=>{
  userManager.getInstance().addAdmin(socket);
})

async function main(){
  await subscriberManager.getInstance();
  subscriberManager.getInstance().run();
}
main();