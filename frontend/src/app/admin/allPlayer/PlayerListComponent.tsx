"use client"
import { adminApi } from '@/app/keys/adminKeys';
import React, { useState } from 'react';
import toast,{Toaster} from 'react-hot-toast';

const headerContent = {
  'Content-Type': 'application/json',
}
export const PlayerList = ({ players }: { 
  players: Array<{ 
    playerId: string; 
    playerName: string; 
    basePrice: number; 
    playerState: 'Listed' | 'Not Listed' | 'Sold'; 
  }> 
}) => {
  const [searchId, setSearchId] = useState('');
  const [searchName, setSearchName] = useState('');
  const [filterState, setFilterState] = useState<'All' | 'Listed' | 'Not Listed' | 'Sold'>('All');

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
      if(json.msg === "playerAlreadyInBid") toast.error("player already in bid");
      else toast.success(json.msg);
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
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-3xl border border-green-500">
        <h2 className="text-3xl font-bold mb-4 text-green-300">Player List</h2>
        
        <div className="mb-4 flex space-x-4">
          <input
            type="text"
            placeholder="Search by ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="flex-1 p-2 bg-gray-700 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
          />
          <input
            type="text"
            placeholder="Search by Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="flex-1 p-2 bg-gray-700 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
          />
        </div>

        <div className="mb-4">
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value as 'All' | 'Listed' | 'Not Listed' | 'Sold')}
            className="p-2 bg-gray-700 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
          >
            <option value="All">All Players</option>
            <option value="Listed">Listed</option>
            <option value="Not Listed">Not Listed</option>
            <option value="Sold">Sold</option>
          </select>
        </div>
        
        <table className="w-full border border-green-500">
          <thead>
            <tr className="bg-gray-700">
              <th className="py-2 px-4 text-left text-green-200">Player ID</th>
              <th className="py-2 px-4 text-left text-green-200">Player Name</th>
              <th className="py-2 px-4 text-left text-green-200">Base Price</th>
              <th className="py-2 px-4 text-left text-green-200">State</th>
              <th className="py-2 px-4 text-left text-green-200">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map((player) => (
              <tr key={player.playerId} className="hover:bg-gray-600 transition duration-200">
                <td className="py-2 px-4 border-b border-green-500 text-green-100">{player.playerId}</td>
                <td className="py-2 px-4 border-b border-green-500 text-green-100">{player.playerName}</td>
                <td className="py-2 px-4 border-b border-green-500 text-green-100">{player.basePrice}</td>
                <td className={`py-2 px-4 border-b border-green-500 ${getPlayerStateColor(player.playerState)}`}>
                  {player.playerState}
                </td>
                <td className="py-2 px-4 border-b border-green-500">
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
