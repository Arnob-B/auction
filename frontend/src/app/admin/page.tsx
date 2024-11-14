"use client"
import { useEffect, useState } from "react";
import { bidPlacedType, newBidPriceType, newPlayerListedType } from "../types/wsPSubStreamTypes";
import toast,{Toaster} from "react-hot-toast";
import { adminApi, adminWsApi } from "../keys/adminKeys";
import { generalApi } from "../keys/generalApi";
import AdminNavbar from "@/components/AdminNavbar";
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
    <div className="max-w-sm mx-auto bg-gradient-to-tr from-white/10 to-white/15 backdrop-blur-md rounded-lg shadow-lg overflow-hidden mt-6 p-4">
        <h2 className="text-xl font-semibold text-white text-center font-inter">Ban User</h2>
        <div className="flex gap-x-4 items-center">
            <input
              type="text"
              id="userId"
              className="mt-1 block w-full font-opensans bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-red-500"
              placeholder="Enter User ID"
              value={userId}
              onChange={e=>{
                setUserId(e.target.value);
              }}
              required
              />
          <button
            type="submit"
            className="w-fit h-fit bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 transition duration-200 font-opensans"
            onClick={banUserHandler}
            >
            Ban
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
  <div className="w-5/6 bg-gradient-to-tr from-white/10 to-white/15 backdrop-blur-md rounded-lg shadow-lg h-fit mt-8 p-6">
    <h2 className="text-xl font-semibold font-inter text-white text-center">Add Player</h2>
      <div className="my-4 font-opensans">
        <label htmlFor="playerId" className="block text-white">Player ID</label>
        <input 
          type="text" 
          id="playerId" 
          className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-blue-500" 
          placeholder="Enter Player ID" 
          value = {id}
          onChange={(e)=>setId(e.target.value)}
          required 
        />

      </div>
      <div className="mb-4 font-opensans">
        {/* <label htmlFor="incrementPrice" className="block text-white">Increment Price</label> */}

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
        <label htmlFor="basePrice" className="block text-white mt-2">Base Price</label>

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
        className="w-full bg-blue-600 text-white py-1 my-2 rounded-md hover:bg-blue-700 transition duration-200 font-opensans"
        onClick={addPlayerHandler}
      >
        Add Player
      </button>
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
      <div className="w-[93%] bg-gradient-to-tr from-white/10 to-white/15 backdrop-blur-md rounded-lg shadow-lg overflow-hidden mt-6 p-4">
          <h2 className="text-xl font-semibold text-white text-center font-inter">Change Bid Price</h2>
          <div className="flex gap-x-6 items-center justify-around">
            <input
              type="number"
              id="incrementPrice"
              className="mt-1 block w-fit h-fit font-opensans bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter Increment Price"
              value={price === 0? "" :price }
              onChange={e => setPrice(parseInt(e.target.value) || 0)} // Ensure default to 0 if NaN
              step={10}
              required
            />
          <button
            type="button" // Change type to "button"
            className="w-fit font-opensans h-fit bg-blue-600 text-white py-1 px-2 rounded-md hover:bg-blue-700 transition duration-200"
            onClick={priceChangeHandler}
            >
            Set Price
          </button>
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
    <div className="w-full justify-self-center bg-gradient-to-tr from-white/10 to-white/15 backdrop-blur-md rounded-lg shadow-lg mt-6 p-4">
        <h2 className="text-xl font-semibold text-white text-center font-inter">Bid Profile</h2>
        <div className="mt-4 flex flex-col gap-2 font-opensans">
          <p className="text-white">Player ID: <span className="font-semibold">{playerDetails.playerId}</span></p>
          <p className="text-white">Player Name: <span className="font-semibold">{playerDetails.playerName}</span></p>
          <p className="text-white">Base Price: <span className="font-semibold text-green-400">{playerDetails.basePrice}</span></p>
          <p className="text-white">Current Price: <span className="font-semibold text-green-400">{playerDetails.currentPrice}</span></p>
          <p className="text-white">Next Bid Price: <span className="font-semibold text-green-400">{playerDetails.nextPrice}</span></p>
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
    <div className="w-4/5 bg-gradient-to-tr from-white/10 to-white/15 backdrop-blur-md rounded-lg shadow-lg overflow-hidden mt-6 p-4">
        <h2 className="text-xl font-semibold text-white text-center font-inter">Bid Control Panel</h2>
        <div className="mt-6 flex flex-col space-y-4 font-opensans">
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
  const [isLive , setIsLive] = useState<boolean>(false);
  useEffect(()=>{
    const wsClient = new WebSocket(adminWsApi);
    const main = async(wsClient:WebSocket)=>{
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

      wsClient.onopen = ()=>{
          
        setInterval(()=>{
          wsClient.send("ping");
        },50000)
        setIsLive(() => {
          return true;
        })
      }
      wsClient.onclose = () => {
        setIsLive(() => {
          return false;
        })
      }
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
    main(wsClient);
    return (()=>{
      if(wsClient.readyState)wsClient.close();
    })
  },[]);
  return (
    <>
    <div className="min-h-screen w-[98vw] relative flex flex-col sm:flex-row justify-center p-16">
      <AdminNavbar />
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
      <LiveButton isLive={isLive}></LiveButton>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 place-items-center">
        <BidProfile playerDetails={playerDetails} />
        <BidControl/>
        <PriceControl/>
        <BanUser/>
      </div>
      <div className="sm:w-1/2 flex justify-center mt-4">
        <AddPlayer/>
      </div>
          </div>
    </>
  )
}

function LiveButton({ isLive }:{isLive:boolean}) {
  return (
    <button
      className={`px-6 py-2 font-bold fixed top-8 left-8 text-white rounded-md font-opensans
        ${isLive ? 'bg-red-500 neon-shadow' : 'bg-gray-400/20'}
      `}
      style={{
        transition: 'all 0.3s ease-in-out',
      }}
    >
      {isLive ? 'LIVE' : 'OFFLINE'}
      <style jsx>{`
        .neon-shadow {
          box-shadow: 
            0 0 5px #ff1a1a, 
            0 0 10px #ff1a1a, 
            0 0 20px #ff1a1a, 
            0 0 30px #ff1a1a;
        }
      `}</style>
    </button>
  );
}
