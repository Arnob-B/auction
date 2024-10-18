"use client"
import { useEffect, useState } from "react";
import { bidPlacedType, newBidPriceType, newPlayerListedType } from "../types/wsPSubStreamTypes";
const headerContent = {
  'Content-Type': 'application/json',
}
const BanUser = ()=>{
  const [userId, setUserId] = useState("");
  const banUserHandler = async ()=>{
    await fetch('http://localhost:3000/admin/banUser',{
      method:"POST",
      headers:headerContent,
      body: JSON.stringify({
        userId: userId
      })
    });
  }
  return (
    <div className="max-w-sm mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden mt-6">
      <div className="p-4">
        <h2 className="text-xl font-bold text-white text-center">Ban User</h2>
          <div className="mb-4">
            <label for="userId" className="block text-white">User ID</label>
            <input
              type="text"
              id="userId"
              className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-red-500"
              placeholder="Enter User ID"
              value={userId}
              onChange={e=>{
                setUserId(e.target.value);
              }}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-200"
            onClick={banUserHandler}
          >
            Ban User
          </button>
      </div>
    </div>
  )
}
const AddPlayer=()=>{
  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState(0);
  const addPlayerHandler = async()=>{
    const res = await fetch('http://localhost:3000/admin/addPlayer',{
      method:"POST",
      headers:headerContent,
      body:JSON.stringify({
          id:id,
          name:name,
          basePrice:price
        })
    })
  }
  return(
  <>
  <div className="max-w-sm mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden mt-6">
  <div className="p-4">
    <h2 className="text-xl font-bold text-white text-center">Add Player</h2>
      <div className="mb-4">
        <label for="playerId" className="block text-white">Player ID</label>
        <input 
          type="text" 
          id="playerId" 
          className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500" 
          placeholder="Enter Player ID" 
          value = {id}
          onChange={(e)=>setId(e.target.value)}
          required 
        />
        <label for="playerName" className="block text-white">Player Name</label>
        <input 
          type="text" 
          id="playerId" 
          className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500" 
          placeholder="Enter Player Name" 
          value = {name}
          onChange={(e)=>setName(e.target.value)}
          required 
        />
        <label for="basePrice" className="block text-white">Base Price</label>
        <input 
          type="number" 
          id="playerId" 
          className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500" 
          placeholder="Enter base Price" 
          value = {price}
          onChange={(e)=>setPrice(parseInt(e.target.value)|| 0)}
          required 
        />
      </div>
      <button 
        type="submit" 
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        onClick={addPlayerHandler}
      >
        Add Player
      </button>
  </div>
</div>
</>
  )
}

const PriceControl = () => {
  const [price, setPrice] = useState(0);


  const priceChangeHandler = async () => {
    try {
      const res = await fetch('http://localhost:3000/admin/changeNextPrice', {
        method: 'POST',
        headers: headerContent,
        body: JSON.stringify({ incrementPrice: price }),
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json(); // Handle the response data as needed
      console.log(data);
    } catch (error) {
      console.error('Price change error:', error);
    }
  };

  return (
    <div>
      <div className="max-w-sm mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden mt-6">
        <div className="p-4">
          <h2 className="text-xl font-bold text-white text-center">Change Bid Price</h2>
          <div className="mb-4">
            <label htmlFor="incrementPrice" className="block text-white">Increment Price</label>
            <input
              type="number"
              id="incrementPrice"
              className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter Increment Price"
              value={price === 0? "" :price }
              onChange={e => setPrice(parseInt(e.target.value) || 0)} // Ensure default to 0 if NaN
              step={10}
              required
            />
          </div>
          <button
            type="button" // Change type to "button"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            onClick={priceChangeHandler}
          >
            Set Price
          </button>
        </div>
      </div>
    </div>
  );
};
const BidProfile = ({playerDetails}:{playerDetails:{
    playerId:string,
    playerName: string,
    basePrice: number,
    currentPrice: number,
    nextPrice:number
}}) => {
  return (
    <div className="max-w-sm mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden mt-6">
      <div className="p-4">
        <h2 className="text-xl font-bold text-white text-center">Bid Profile</h2>
        <div className="mt-4">
          <p className="text-white">Player ID: <span className="font-semibold">{playerDetails.playerId}</span></p>
          <p className="text-white">Player Name: <span className="font-semibold">{playerDetails.playerName}</span></p>
          <p className="text-white">Base Price: <span className="font-semibold text-green-400">{playerDetails.basePrice}</span></p>
          <p className="text-white">Current Price: <span className="font-semibold text-green-400">{playerDetails.currentPrice}</span></p>
          <p className="text-white">Next Bid Price: <span className="font-semibold text-green-400">{playerDetails.nextPrice}</span></p>
        </div>
      </div>
    </div>
  )
}
const BidControl = () => {
  const   onSellHandler = async ()=>{
    const res = await fetch("http://localhost:3000/admin/sellPlayer",{method:"POST"});
    alert(res);
  }
  const onStartHandler = async ()=>{
    const res = await fetch("http://localhost:3000/admin/controls",{
      method:"POST",
      headers:headerContent,
      body:JSON.stringify({
        state:"START"
      })
    });
    alert(res);
  }
  const onStopHandler = async () => {
    const res = await fetch("http://localhost:3000/admin/controls", {
      method:"POST",
      headers:headerContent,
      body: JSON.stringify({
        state: "STOP"
      })
    });
    alert(res);
  }
  return (
    <div className="max-w-sm mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden mt-6">
      <div className="p-4">
        <h2 className="text-xl font-bold text-white text-center">Bid Control Panel</h2>
        <div className="mt-6 flex flex-col space-y-4">
          <button
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200"
            onClick={onStartHandler}
          >
            Start
          </button>
          <button
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-200"
            onClick={onStopHandler}
          >
            Stop
          </button>
          <button
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            onClick={onSellHandler}
          >
            Sell
          </button>
        </div>
      </div>
    </div>
  )
}
export default function Page() {
  const [playerDetails,setPlayerDetails] = useState<{
    playerId:string,
    playerName: string,
    basePrice: number,
    currentPrice: number,
    nextPrice:number
  }>({
    playerId:"",
    playerName: "",
    basePrice: 0,
    currentPrice: 0,
    nextPrice:0
  });
  useEffect(()=>{
    const main = async()=>{
      const res = await fetch("http://localhost:3000/getCurrentPlayer");
      const body = await res.json();
      const data = body.msg;
      setPlayerDetails({
        playerId: data.id,
        playerName: data.name,
        basePrice: data.basePrice,
        currentPrice: data.currentPrice,
        nextPrice: data.nextBid
      });

      const wsClient = new WebSocket("http://localhost:3003/");
      wsClient.onmessage = (message) => {
        const msg = JSON.parse(message.data);
        if (msg.type === newPlayerListedType) {
          const body = msg.body;
          setPlayerDetails({
            playerId: body.playerId,
            playerName: body.playerName,
            basePrice: body.basePrice,
            currentPrice: body.currentPrice,
            nextPrice: body.currentPrice
          })
        }
        if (msg.type === bidPlacedType) {
          const body = msg.body;
          setPlayerDetails((prev) => {
            if (prev.playerId === body.playerId)
              return {
                ...prev,
                currentPrice: body.amount,
                nextPrice: body.nextPrice,
              }
            else {
              //get the latest user
              alert("reload this page as player is not up to date");
              return prev;
            }
          });
        }
        if (msg.type === newBidPriceType) {
          const body = msg.body;
          setPlayerDetails(prev => {
            if (prev.playerId === body.playerId)
              return {
                ...prev,
                nextPrice: body.nextPrice
              }
            else {
              alert("reload this page as player is not up to date");
              return prev;
            }
          });
        }
      }
    }
    main();
  },[]);
  return (
    <>
      <BidProfile playerDetails={playerDetails}></BidProfile>
      <BidControl></BidControl>
      <PriceControl></PriceControl>
      <AddPlayer></AddPlayer>
      <BanUser></BanUser>
    </>
  )
}