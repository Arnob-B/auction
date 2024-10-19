"use client"
import React, { useEffect, useState } from "react"
import { bidPlacedType } from "../../types/wsPSubStreamTypes";
import { adminWsApi } from "@/app/keys/adminKeys";


const LeaderBoard = ({ bidders }:{
  bidders: Array<{
    bidderId: string,
    bidderName: string,
    playerId: string,
    amount: number
  }>
}) => {
  return (
    <div className="max-w-lg mx-auto bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-lg overflow-hidden mt-6">
      <h2 className="text-2xl font-bold text-white text-center p-4">Leaderboard</h2>
      <table className="min-w-full bg-gray-900 ">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left text-gray-400">Bidder ID</th>
            <th className="py-2 px-4 text-left text-gray-400">Bidder Name</th>
            <th className="py-2 px-4 text-left text-gray-400">Player ID</th>
            <th className="py-2 px-4 text-left text-gray-400">Amount</th>
          </tr>
        </thead>
        <tbody>
          {bidders.map((bidder, index) => (
            <tr 
              key={bidder.bidderId} 
              className={`border-b border-gray-700 transition-transform transform duration-300 ease-in-out opacity-0 animate-fadeIn`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <td className="py-2 px-4 text-white">{bidder.bidderId}</td>
              <td className="py-2 px-4 text-white">{bidder.bidderName}</td>
              <td className="py-2 px-4 text-white">{bidder.playerId}</td>
              <td className="py-2 px-4 text-white">{bidder.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s forwards;
        }
      `}</style>
    </div>
  );
};


export default function Page(){
  const [bidderList, setBidderList] = useState<Array<{
    bidderId: string,
    bidderName: string,
    playerId: string,
    amount: number
  }>>([]);

  useEffect(()=>{
    const wsClient = new WebSocket(adminWsApi);
    wsClient.onmessage=message=>{
      try {
        const msg = message.data;
        const data = JSON.parse(msg);
        const body = data.body;
        if(data.type === bidPlacedType){
          setBidderList(prev => {
            return [
              ...prev,
              {
                bidderId:body.bidderId,
                playerId: body.playerId,
                bidderName: body.bidderName,
                amount: body.amount
              }
            ]
          });
        }
      }
      catch(err) {console.log(err)};
    };
    return (()=>{
      wsClient.close();
    })
  },[]);
  return (
    <>
    <LeaderBoard bidders={bidderList}></LeaderBoard>
    </>
  )
}