"use client"
import { adminApi } from '@/app/keys/adminKeys';
import AdminNavbar from '@/components/AdminNavbar';
import React, { useState } from 'react';
import toast,{Toaster} from 'react-hot-toast';
// import { playerState } from '@prisma/client';
// import fetchPlayers from "./fetchPlayers";
// import { useRouter } from 'next/navigation';

const headerContent = {
  'Content-Type': 'application/json',
}

export const PlayerList = ({players}:{players:{ 
  playerId: string; 
  playerName: string; 
  basePrice: number; 
  playerState: 'Listed' | 'Not Listed' | 'Sold'; 
}[]}) => {
  // const router = useRouter();
  const [searchId, setSearchId] = useState('');
  const [searchName, setSearchName] = useState('');
  const [filterState, setFilterState] = useState<'All' | 'Listed' | 'Not Listed' | 'Sold'>('All');

  // const [players, setPlayers] = useState<Array<{ 
  //   playerId: string; 
  //   playerName: string; 
  //   basePrice: number; 
  //   playerState: 'Listed' | 'Not Listed' | 'Sold'; 
  // }>>([]);

  // useEffect(()=>{
  //   // fetch("/api/admin/getAllPlayers", {cache: 'no-store'})
  //   // .then(res=>res.json())
  //   fetchPlayers()
  //   .then(res=>{
  //     const updatedPlayers = [];
  //     for(const a of res){
  //       let state: 'Listed' | 'Not Listed' | 'Sold'; 
  //       switch (a.state){
  //         case playerState.LISTED:
  //           state = 'Listed';
  //           break;
  //         case playerState.NOTLISTED:
  //           state = 'Not Listed';
  //           break;
  //         default:
  //           state = 'Sold';
  //           break;
  //       }
  //       updatedPlayers.push({
  //         playerId:a.id,
  //         playerName:a.name,
  //         basePrice:a.basePrice,
  //         playerState: state
  //       });
  //     }
  //     setPlayers(updatedPlayers);
  //   })
  // },[])
  
  const filteredPlayers = players.filter(player => {
    const matchesId = player.playerId.includes(searchId);
    const matchesName = player.playerName.toLowerCase().includes(searchName.toLowerCase());
    const matchesState = filterState === 'All' || player.playerState === filterState;
    
    return matchesId && matchesName && matchesState;
  });
  
  const listPlayerHandler = (playerId: string, playerName: string, basePrice: number) => {
    return async () => {
      const res = await fetch(adminApi+'/addPlayer', {
        method: "POST",
        headers: headerContent,
        body: JSON.stringify({
          id: playerId,
          name: playerName,
          basePrice: basePrice
        })
      });
      const json = await res.json();
      if(json.msg === "playerAlreadyInBid") toast.error("Player already in bid");
      else toast.success(json.msg);
      // setTimeout(()=>{
      //   router.refresh();
      // },1000);
    };
  };

  const getPlayerStateColor = (state: 'Listed' | 'Not Listed' | 'Sold') => {
    switch (state) {
      case 'Listed':
        return 'text-orange-400'; // Orange for Listed
      case 'Not Listed':
        return 'text-red-400'; // Red for Not Listed
      case 'Sold':
        return 'text-green-400'; // Green for Sold
      default:
        return '';
    }
  };

  return (
    <>
      <Toaster
        position="bottom-left"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: '',
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },

          // Default options for specific types
          success: {
            duration: 3000,
            iconTheme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
    <div className="min-h-screen text-white flex items-center justify-center p-4 relative">
      <AdminNavbar />
      <button 
      className='fixed bottom-5 right-5 bg-primary text-white h-7 w-7 rounded-full' 
      onClick={()=>{
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }}>
        &uarr;
        </button>
      <div className="mt-20 rounded-lg shadow-lg p-6 w-full max-w-3xl bg-gradient-to-tr from-[#00000040] via-[#00000020] to-secondary backdrop-blur-lg border border-[#ffffff40]">
        <h2 className="text-4xl font-bold mb-4 text-primary text-center font-inter">Player List</h2>
        
        <div className="mb-4 flex space-x-4">
          <input
            type="text"
            placeholder="Search by ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="flex-1 p-2 bg-secondary font-inter rounded border border-accent focus:outline-none focus:ring-2 focus:ring-accent transition duration-200"
          />
          <input
            type="text"
            placeholder="Search by Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="flex-1 p-2 bg-secondary font-inter rounded border border-accent focus:outline-none focus:ring-2 focus:ring-accent transition duration-200"
          />
        </div>

        <div className="mb-4">
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value as 'All' | 'Listed' | 'Not Listed' | 'Sold')}
            className="p-2 bg-secondary rounded border font-inter border-accent focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
          >
            <option value="All">All Players</option>
            <option value="Listed">Listed</option>
            <option value="Not Listed">Not Listed</option>
            <option value="Sold">Sold</option>
          </select>
        </div>
        
        <table className="w-full border border-accent">
          <thead>
            <tr className="bg-secondary border-b border-b-accent font-inter font-thin">
              <th className="py-2 px-4 text-left text-white">Player ID</th>
              <th className="py-2 px-4 text-left text-white">Player Name</th>
              <th className="py-2 px-4 text-left text-white">Base Price</th>
              <th className="py-2 px-4 text-left text-white">State</th>
              <th className="py-2 px-4 text-left text-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map((player) => (
              <tr key={player.playerId} className="hover:bg-primary/50 transition duration-200 font-opensans">
                <td className="py-2 px-4 border-b border-accent text-white">{player.playerId}</td>
                <td className="py-2 px-4 border-b border-accent text-white">{player.playerName}</td>
                <td className="py-2 px-4 border-b border-accent text-white">{player.basePrice}</td>
                <td className={`py-2 px-4 border-b border-accent ${getPlayerStateColor(player.playerState)}`}>
                  {player.playerState}
                </td>
                <td className="py-2 px-4 border-b border-accent">
                  <button
                    className="bg-green-600 hover:bg-green-500 text-white font-semibold py-1 px-4 rounded transition duration-200 shadow-lg hover:shadow-xl"
                    onClick={listPlayerHandler(player.playerId, player.playerName, player.basePrice)}
                  >
                    List
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};
