import fetchPlayers from "./fetchPlayers";
import { PlayerList } from "./PlayerListComponent";
import { playerState } from "@prisma/client";

export default async function  Page(){
  const res = await fetchPlayers();
  const players = [];
  for(const a of res){
    let state: 'Listed' | 'Not Listed' | 'Sold'; 
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
    <PlayerList players={players} />
    </>
  )
}

export const dynamic = "force-dynamic"
