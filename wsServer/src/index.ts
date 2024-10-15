import { WebSocketServer } from "ws";
import express from "express"
import User from "./utils/userManager";
import { publish } from "./types/engineMessage";
import userManager from "./utils/userManager";
const app = express();
const server = app.listen(3002,()=>{
  console.log("WS server started on port",3002);
});
const wss = new WebSocketServer({server});
wss.on('connection', socket => {
  userManager.getInstance().addUser(socket);
});