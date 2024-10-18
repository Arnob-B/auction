"use client"
import { useState } from "react";
const BanUser = ()=>{
  const [userId, setUserId] = useState("");
  const banUserHandler = async ()=>{
    await fetch('http://localhost:3000/admin/banUser',{
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
  return(
  <>
  <div className="max-w-sm mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden mt-6">
  <div className="p-4">
    <h2 className="text-xl font-bold text-white text-center">Add Player</h2>
    <form className="mt-4">
      <div className="mb-4">
        <label for="playerId" className="block text-white">Player ID</label>
        <input 
          type="text" 
          id="playerId" 
          className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500" 
          placeholder="Enter Player ID" 
          required 
        />
        <label for="playerName" className="block text-white">Player Name</label>
        <input 
          type="text" 
          id="playerId" 
          className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500" 
          placeholder="Enter Player Name" 
          required 
        />
        <label for="basePrice" className="block text-white">Base Price</label>
        <input 
          type="number" 
          id="playerId" 
          className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500" 
          placeholder="Enter base Price" 
          required 
        />
      </div>
      <button 
        type="submit" 
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Add Player
      </button>
    </form>
  </div>
</div>
</>
  )
}

const PriceControl = () => {
  const [price,setPrice] = useState(0);
  const priceChangeHandler = async ()=>{
    const res = await fetch("http://localhost:3000/admin/changeNextPrice",{
      body:JSON.stringify(
        {incrementPrice:price}
      )
    })
    console.log(res);
  }
  return <div>
    <div className="max-w-sm mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden mt-6">
      <div className="p-4">
        <h2 className="text-xl font-bold text-white text-center">Change Bid Price</h2>
        <form className="mt-4">
          <div className="mb-4">
            <label for="incrementPrice" className="block text-white">Increment Price</label>
            <input
              type="number"
              id="incrementPrice"
              className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter Increment Price"
              value={price}
              onChange={e=>setPrice(parseInt(e.target.value))}
              step={10}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            onClick={priceChangeHandler}
          >
            Set Price
          </button>
        </form>
      </div>
    </div>
  </div >
}
const BidProfile = () => {
  return (
    <div className="max-w-sm mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden mt-6">
      <div className="p-4">
        <h2 className="text-xl font-bold text-white text-center">Bid Profile</h2>
        <div className="mt-4">
          <p className="text-white">Player ID: <span className="font-semibold">12345</span></p>
          <p className="text-white">Player Name: <span className="font-semibold">12345</span></p>
          <p className="text-white">Base Price: <span className="font-semibold text-green-400">$1,000,000</span></p>
          <p className="text-white">Current Price: <span className="font-semibold text-green-400">$1,200,000</span></p>
          <p className="text-white">Increment Price: <span className="font-semibold text-green-400">$50,000</span></p>
        </div>
      </div>
    </div>
  )
}
const BidControl = () => {
  const   onSellHandler = async ()=>{
    const res = await fetch("http://localhost:3000/admin/sellPlayer");
    console.log(res);
  }
  const onStartHandler = async ()=>{
    const res = await fetch("http://localhost:3000/admin/controls",{
      body:JSON.stringify({
        state:"START"
      })
    });
    console.log(res);
  }
  const onStopHandler = async () => {
    const res = await fetch("http://localhost:3000/admin/controls", {
      body: JSON.stringify({
        state: "STOP"
      })
    });
    console.log(res);
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
  return (
    <>
      <BidProfile></BidProfile>
      <BidControl></BidControl>
      <PriceControl></PriceControl>
      <AddPlayer></AddPlayer>
      <BanUser></BanUser>
    </>
  )
}