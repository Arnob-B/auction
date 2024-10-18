"use client"
import React, { useEffect, useState } from "react"
import { bidPlacedType } from "../types/wsPSubStreamTypes";

const LeaderBoard = ({ bidders }:{bidders:Array<{
  // bidderId:string,
  bidderName:string,
  playerId:string,
  amount:number
}>}) => {
  return (
    <div className="max-w-lg mx-auto bg-gray-900 rounded-lg shadow-lg overflow-hidden mt-6">
      <h2 className="text-xl font-bold text-white text-center p-4">Leaderboard</h2>
      <table className="min-w-full bg-gray-800">
        <thead>
          <tr>
            {/* <th className="py-2 px-4 text-left text-gray-300">Bidder ID</th> */}
            <th className="py-2 px-4 text-left text-gray-300">Bidder Name</th>
            <th className="py-2 px-4 text-left text-gray-300">Player ID</th>
            <th className="py-2 px-4 text-left text-gray-300">Amount</th>
          </tr>
        </thead>
        <tbody>
          {bidders.map((bidder) => (
            <tr key={bidder.bidderName} className="border-b border-gray-700">
              {/* <td className="py-2 px-4 text-white">{bidder.bidderId}</td> */}
              <td className="py-2 px-4 text-white">{bidder.bidderName}</td>
              <td className="py-2 px-4 text-white">{bidder.playerId}</td>
              <td className="py-2 px-4 text-white">{bidder.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function Page(){
  const [bidderList, setBidderList] = useState<Array<{
    // bidderId: string,
    bidderName: string,
    playerId: string,
    amount: number
  }>>([]);

  useEffect(()=>{
    const wsClient = new WebSocket('ws://localhost:3002/');
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
  },[]);
  return (
    <>
    <LeaderBoard bidders={bidderList}></LeaderBoard>
    </>
  )
}