"use client"
import { useEffect, useState } from "react";
import { bidPlacedType, newBidPriceType, newPlayerListedType } from "../types/wsPSubStreamTypes";
import toast,{Toaster} from "react-hot-toast";
import { adminApi, adminWsApi } from "../keys/adminKeys";
import { generalApi } from "../keys/generalApi";
const headerContent = {
  'Content-Type': 'application/json',
}
const BanUser = ()=>{
  const [userId, setUserId] = useState("");
  const banUserHandler = async ()=>{
    const res = await fetch(adminApi+'/banUser',{
      method:"POST",
      headers:headerContent,
      body: JSON.stringify({
        userId: userId
      })
    });
    const json = await res.json();
    toast(json.msg);
  }
  return (
    <div className="max-w-sm mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden mt-6">
      <div className="p-4">
        <h2 className="text-xl font-bold text-white text-center">Ban User</h2>
          <div className="mb-4">
            <label htmlFor="userId" className="block text-white">User ID</label>
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
    const res = await fetch(adminApi+'/addPlayer',{
      method:"POST",
      headers:headerContent,
      body:JSON.stringify({
          id:id,
          name:name,
          basePrice:price
        })
    })
    const json = await res.json();
    toast(json.msg);
  }
  return(
  <>
  <div className="max-w-sm mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden mt-6">
  <div className="p-4">
    <h2 className="text-xl font-bold text-white text-center">Add Player</h2>
      <div className="mb-4">
        <label htmlFor="playerId" className="block text-white">Player ID</label>
        <input 
          type="text" 
          id="playerId" 
          className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500" 
          placeholder="Enter Player ID" 
          value = {id}
          onChange={(e)=>setId(e.target.value)}
          required 
        />

      </div>
      <div className="mb-4">
        <label htmlFor="incrementPrice" className="block text-white">Increment Price</label>

        <label htmlFor="playerName" className="block text-white">Player Name</label>
        <input 
          type="text" 
          id="playerId" 
          className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500" 
          placeholder="Enter Player Name" 
          value = {name}
          onChange={(e)=>setName(e.target.value)}
          required 
        />
        <label htmlFor="basePrice" className="block text-white">Base Price</label>

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
      const res = await fetch(adminApi+'/changeNextPrice', {
        method: 'POST',
        headers: headerContent,
        body: JSON.stringify({ incrementPrice: price }),
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json(); // Handle the response data as needed
      toast(data.msg);
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
    const res = await fetch(adminApi+"/sellPlayer",{method:"POST"});
    const json = await res.json();
    toast(json.msg);
  }
  const onStartHandler = async ()=>{
    const res = await fetch(adminApi+"/controls",{
      method:"POST",
      headers:headerContent,
      body:JSON.stringify({
        state:"START"
      })
    });
    const json =await res.json();
    toast(json.msg);
  }
  const onStopHandler = async () => {
    const res = await fetch(adminApi+'/controls', {
      method:"POST",
      headers:headerContent,
      body: JSON.stringify({
        state: "STOP"
      })
    });
    const json =await res.json();
    toast(json.msg);
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
      const res = await fetch(generalApi+"/getCurrentPlayer");
      const body = await res.json();
      const data = body.msg;
      setPlayerDetails({
        playerId: data.id,
        playerName: data.name,
        basePrice: data.basePrice,
        currentPrice: data.currentPrice,
        nextPrice: data.nextBid
      });

      const wsClient = new WebSocket(adminWsApi);
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
      <BidProfile playerDetails={playerDetails}></BidProfile>
      <BidControl></BidControl>
      <PriceControl></PriceControl>
      <AddPlayer></AddPlayer>
      <BanUser></BanUser>
    </>
  )
}