import { createClient } from "redis";


const main = async ()=>{
  const client = createClient();
  await client.connect();
  while (true) {
    const msg = await client.rPop("dbProcess");
  }
}