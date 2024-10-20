import { playerState, PrismaClient } from "@prisma/client";
import { PlayerList } from "./PlayerListComponent";

export default async function  Page(){
  const client = new PrismaClient();
  let players = [];
  const res = await client.player.findMany();
  for(let a of res){
    var state: 'Listed' | 'Not Listed' | 'Sold'; 
    switch (a.state){
      case playerState.LISTED:
        state = 'Listed';
        break;
      case playerState.NOTLISTED:
        state = 'Not Listed';
        break;
      default:
        state = 'Sold';
        break;
    }
    players.push({
      playerId:a.id,
      playerName:a.name,
      basePrice:a.basePrice,
      playerState: state
    });
  }
  return (
    <>
    <PlayerList players={players}></PlayerList>
    </>
  )
}
