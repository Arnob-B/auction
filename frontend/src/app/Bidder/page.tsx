"use client"

import { useEffect, useState } from "react"

function Card(){
  return (
    <div className="max-w-xs mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <img className="w-full h-48 object-cover" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/C._Ronaldo_-_Ballon_d%27Or_2014.jpg/261px-C._Ronaldo_-_Ballon_d%27Or_2014.jpg" alt="Player Image"/>
        <div className="p-4">
          <h2 className="text-xl font-bold text-white">Player Name</h2>
          <p className="text-gray-300">Stats: Goals - 20 | Assists - 10 | Matches - 30</p>
          <div className="mt-4">
            <span className="text-lg font-semibold text-white">Base Price:</span>
            <span className="text-lg font-bold text-green-400">$1,000,000</span>
          </div>
        </div>
    </div>
  )
}
function LeaderBoard(){
  const [bidderlist, setBidderList] = useState<[string, number][]>([
    ['user3', 1000],
    ['user2', 1500],
    ['user1', 2000]
  ]);
  useEffect(()=>{
    fetch("http://localhost:3000/getCurrentPlayer").then(res =>
    {
      res.json().then(data =>{
        console.log(data);
      });
    }
    );
  },[]);
  return(
    <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden mt-6">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white text-center">Bidding Leaderboard</h2>
      </div>
      <ul className="divide-y divide-gray-700 flex flex-col-reverse">
        {bidderlist.map(e => {
          return (
            <li className="flex justify-between items-center p-4">
              <span className="text-white">{e[0]}</span>
              <span className="text-green-400 font-bold">{e[1]}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
function PlaceBid() {
  return (
    <div className="max-w-sm mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden mt-6">
      <div className="p-4">
        <h2 className="text-xl font-bold text-white text-center">Place Your Bid</h2>
        <form className="mt-4">
          <div className="mb-4">
            <label className="block text-white">User ID</label>
            <input
              type="text"
              id="userId"
              className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter your User ID"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Place Bid
          </button>
        </form>
      </div>
    </div>
  )
}
export default function Page(){
  useEffect(()=>{
  });
  return(
    <div className="w-screen h-screen flex-col items-center">
      <Card></Card>
      <PlaceBid></PlaceBid>
      <LeaderBoard></LeaderBoard>
    </div>
  )
}