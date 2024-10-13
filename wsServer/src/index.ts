import express from "express"
const app = express();
const server = app.listen(3001,()=>{
  console.log("WS server started on port",3001);
});
