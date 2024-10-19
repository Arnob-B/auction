"use client"

import { cache, useEffect, useState } from "react"
import { bidPlacedType, getControlType, newBidPriceType, newPlayerListedType, playerSoldType, userBannedType } from "../types/wsPSubStreamTypes";
import toast,{Toaster} from "react-hot-toast";
import { generalApi, generalWsApi } from "../keys/generalApi";

type playerDetailsType = {
  id : string,
  name: string,
  basePrice : number,
  currentPrice:number
}
function Card({playerDetails}:{playerDetails:playerDetailsType}){
  const [playerStats,setPlayerStats] = useState();
  return (
    <div className="max-w-xs mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <img className="w-full h-48 object-cover" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/C._Ronaldo_-_Ballon_d%27Or_2014.jpg/261px-C._Ronaldo_-_Ballon_d%27Or_2014.jpg" alt="Player Image"/>
        <div className="p-4">
          <h2 className="text-xl font-bold text-white">{playerDetails.name}</h2>
          <p className="text-gray-300"></p>
          <div className="mt-4">
            <span className="text-lg font-semibold text-white">Base Price:</span>
            <span className="text-lg font-bold text-green-400">{playerDetails.basePrice}</span>
          </div>
          <div className="mt-4">
            <span className="text-lg font-semibold text-white">currentPrice Price:</span>
            <span className="text-lg font-bold text-green-400">{playerDetails.currentPrice}</span>
          </div>
        </div>
    </div>
  )
}
function LeaderBoard({bidderList}:{bidderList:[string,number][]}){
  return(
    <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden mt-6">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white text-center">Bidding Leaderboard</h2>
      </div>
      <ul className="divide-y divide-gray-700 flex flex-col-reverse">
        {bidderList.map(e => {
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
function PlaceBid({playerId ,bidAmnt}:{playerId:string,  bidAmnt:number}) {
  const [id,setId] = useState<string>("");
  function submit(){
    fetch(generalApi+'/bid', {
      method:"POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        playerId: playerId,
        bidderId: id,
        amnt : bidAmnt
    }
  )
    }).then(res=>{
      res.json().then(data=>{
        toast(data.msg);
      })
    }
    )
  }
  return (
    <div className="max-w-sm mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden mt-6">
      <div className="p-4">
        <h2 className="text-xl font-bold text-white text-center">Place Your Bid</h2>
          <div className="mb-4">
            <label className="block text-white">User ID</label>
            <input
              type="text"
              name="id"
              id="userId"
              value={id}
              onChange={e=>{
                setId(e.target.value);
              }}
              className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter your User ID"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            onClick={submit}
          >
            {bidAmnt}
          </button>
      </div>
    </div>
  )
}
const AlertBox = ({ playerName, bidderName, sellingAmount, onClose }:{ playerName:string, bidderName:string, sellingAmount:number, onClose:Function }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm mx-auto text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          🎉 Player Sold! 🎉
        </h2>
        <p className="text-gray-300">
          Player Name: <span className="text-white">{playerName}</span>
        </p>
        <p className="text-gray-300">
          Bidder Name: <span className="text-white">{bidderName}</span>
        </p>
        <p className="text-gray-300">
          Selling Amount: <span className="text-white">${sellingAmount}</span>
        </p>
        <button
          className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-500 transition"
          //@ts-ignore
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};
export default function Page(){
  const [playerDetails, setPlayerDetails] = useState<playerDetailsType>({
    id: "",
    name: "",
    basePrice: 0,
    currentPrice: 0
  });
  const [bidderList, setBidderList] = useState<[string, number][]>([
  ]);
  const [nextBid, setNextBid] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<{
    playerName:string
    state:boolean,
    bidderName:string,
    amount:number
  }>({
    playerName:"",
    state:false,
    bidderName:"",
    amount:0
  });
  const handleClose = () => {
    setIsOpen(prev=>{return {...prev,state:false}});
  };
  useEffect(()=>{
    const main = async()=>{
      const res = await fetch(generalApi+'/getCurrentPlayer');
      const body = await res.json();
      const data = body.msg;
      setPlayerDetails({
        id: data.id,
        name: data.name,
        basePrice: data.basePrice,
        currentPrice: data.currentPrice,
      });
      setNextBid(data.nextBid);

      const wsClient = new WebSocket(generalWsApi);
      wsClient.onmessage = (message) => {
        const msg = JSON.parse(message.data);
        const body = msg.body;
        switch (msg.type) {
          case (newPlayerListedType): {
            toast.success("new player is listed");
            setPlayerDetails({
              id: body.playerId,
              name: body.playerName,
              basePrice: body.basePrice,
              currentPrice: body.currentPrice,
            })
            setNextBid(body.currentPrice);
            break;
          }
          case (bidPlacedType): {
            setPlayerDetails((prev) => {
              if (prev.id === body.playerId)
              {
                setNextBid(body.nextPrice);
                return {
                  ...prev,
                  currentPrice: body.amount,
                }
              }
              else {
                //get the latest user
                alert("reload this page as player is not up to date");
                return prev;
              }
            });
            setBidderList(prev=>{
              return [
                ...prev,
                [body.bidderName,body.amount]
              ];
            })
            break;
          }
          case newBidPriceType: {
            toast("new price is set");
            setPlayerDetails(prev => {
              if (prev.id === body.playerId)
                setNextBid(body.nextPrice);
              else {
                alert("reload this page as player is not up to date");
              }
              return prev;
            });
            break;
          }
          case userBannedType:{
            toast(`${body.userName} is banned`);
            break;
          }
          case playerSoldType:{
            console.log(body)
            setIsOpen(prev=>{
              return {
                state: true,
                playerName: body.playerName,
                bidderName: body.bidderName,
                amount: body.amount
              }
            });
            break;
          }
          case getControlType:{
            if(body.state === "START") toast.success("bidding resumed");
            if(body.state === "STOP") toast.error("bidding paused");
            break;
          }
        }
      }
    }
    main();
  },[]);
  console.log(">_<")
  if(playerDetails.id === "")return (
    <>
      No player listed now
    </>
  )
  return(
    <div className="w-screen h-screen flex-col items-center">
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
      {isOpen.state && (
        <AlertBox
          playerName={isOpen.playerName}
          bidderName={isOpen.bidderName}
          sellingAmount={isOpen.amount}
          onClose={handleClose}
        />
      )}
      <Card playerDetails={playerDetails}></Card>
      <PlaceBid bidAmnt={nextBid} playerId={playerDetails.id} ></PlaceBid>
      <LeaderBoard bidderList={bidderList}></LeaderBoard>
    </div>
  )
}