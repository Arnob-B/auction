"use client";

import { useEffect, useState } from "react";
import {
	bidPlacedType,
	getControlType,
	newBidPriceType,
	newPlayerListedType,
	playerSoldType,
	userBannedType,
} from "../types/wsPSubStreamTypes";
import toast, { Toaster } from "react-hot-toast";
import { generalApi, generalWsApi } from "../keys/generalApi";
import UserNavbar from "@/components/UserNavbar";
import LiveButton from "@/components/Bidder/LiveButton";
import NoPlayerListed from "@/components/Bidder/NoPlayerListed";
import LeaderBoard from "@/components/Bidder/Leaderboard";
import AlertBox from "@/components/Bidder/AlertBox";
import getPlayerImageLink from "./getPlayerImage";
// import { unstable_cache } from "next/cache";
import getCachedBalance from "./getCachedBalance";

type playerDetailsType = {
	id: string;
	name: string;
	basePrice: number;
	currentPrice: number;
	imgLink: string;
};

function PlaceBid({
	playerId,
	bidAmnt,
  userId
}: {
	playerId: string;
	bidAmnt: number;
  userId:string;
}) {
	function submit() {
		fetch(generalApi + "/bid", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				playerId: playerId,
				bidderId: userId,
				amnt: bidAmnt,
			}),
		}).then((res) => {
			res.json().then((data) => {
				toast(data.msg);
			});
		});
	}
	return (
    <div className="flex flex-col gap-2 my-6 items-center">
      <h2 className="w-1/2 font-opensans text-center">
      &#8377;{bidAmnt} Lakhs
      </h2>
				<button
					type="submit"
					className="w-2/3 bg-primary text-white py-2 px-4 h-fit rounded-full hover:bg-primary/70 transition-colors duration-200 font-opensans"
					onClick={submit}>
					Place bid
				</button>
    </div>
	);
}

function SmallCard({playerDetails,nextBid,userId}:{playerDetails:playerDetailsType,nextBid:number,userId:string}) {
  return (
    <div className="flex flex-col md:flex-row gap-8 px-8 md:hidden">
      <div className="h-[75vh] flex flex-col justify-end" style={{backgroundImage: `linear-gradient(#3c096c20,#3c096c95,#3c096c), url('${playerDetails.imgLink}')`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center"}}>
      <div className="w-full flex flex-col gap-y-6 justify-center px-3">
        <h1 className="text-3xl font-inter font-medium">{playerDetails.name}</h1>
        {/* <h2 className="text-lg font-inter my-4">Player Id: {playerDetails.id}</h2> */}
        <div className="w-full flex justify-between">
        <div className="flex flex-col">
        <h3 className="text-xl font-inter text-purple-300">Base Price</h3>
        <h3 className="text-lg font-opensans">&#8377;{playerDetails.basePrice} Lakhs</h3>
        </div>
        <div className="flex flex-col">
        <h3 className="text-xl font-inter text-purple-300">Current Price</h3>
        <h3 className="text-lg font-inter">&#8377;{playerDetails.currentPrice} Lakhs</h3>
        </div>
        </div>
      </div>
      </div>
      <PlaceBid bidAmnt={nextBid} playerId={playerDetails.id} userId={userId}></PlaceBid>
    </div>
  )
}

function LargeCard({playerDetails,nextBid,userId}:{playerDetails:playerDetailsType,nextBid:number,userId:string}) {
  return (
    <div className="md:flex flex-col md:flex-row gap-8 px-8 hidden">
      <div className="h-[75vh]">
      <img
				className="h-full w-auto object-cover"
				src={playerDetails.imgLink}
				alt={`${playerDetails.name} Image`}
			/>
			{/* <Image src={playerDetails.imgLink} alt={`${playerDetails.name} Image`} width={400} height={400} className="h-full w-auto object-cover"/> */}
      </div>
      <div className="w-1/2 flex flex-col gap-y-6 justify-center pl-6">
        <h1 className="text-[2.75rem] font-inter font-medium">{playerDetails.name}</h1>
        {/* <h2 className="text-lg font-inter my-4">Player Id: {playerDetails.id}</h2> */}
        <div className="w-full flex justify-between">
        <div className="flex flex-col">
        <h3 className="text-xl font-inter text-primary">Base Price</h3>
        <h3 className="text-lg font-opensans text-center">&#8377;{playerDetails.basePrice} Lakhs</h3>
        </div>
        <div className="flex flex-col">
        <h3 className="text-xl font-inter text-primary">Current Price</h3>
        <h3 className="text-lg font-inter text-center">&#8377;{playerDetails.currentPrice} Lakhs</h3>
        </div>
        </div>
      <PlaceBid bidAmnt={nextBid} playerId={playerDetails.id} userId={userId}></PlaceBid>
      </div>
    </div>
  )
}

export default function ClientCode({userId, userName}:{userId:string, userName:string}) {
	const [playerDetails, setPlayerDetails] = useState<playerDetailsType>({
		id: "",
		name: "",
		basePrice: 0,
		currentPrice: 0,
		imgLink: "",
	});
	const [bidderList, setBidderList] = useState<[string, number][]>([]);
	const [nextBid, setNextBid] = useState<number>(0);
	const [isOpen, setIsOpen] = useState<{
		playerName: string;
		state: boolean;
		bidderName: string;
		amount: number;
	}>({
		playerName: "",
		state: false,
		bidderName: "",
		amount: 0,
	});
	const [isLive, setIsLive] = useState<boolean>(false);
	const [userBalance, setUserBalance] = useState<number>(0);

	const handleClose = () => {
		setIsOpen((prev) => {
			return { ...prev, state: false };
		});
	};

	// const getCachedBalance = unstable_cache(()=>{
	// 	const balance = fetch(`api/user/getBalance/${userId}`);
	// 	return balance;
	// },[],{revalidate:30});

	const updateBalance = () => {
		getCachedBalance(userId)
			// .then((res) => res.json())
			.then((res) => res && setUserBalance(res.balance));
	};

	useEffect(() => {
			const wsClient = new WebSocket(generalWsApi);
		const main = async (wsClient:WebSocket) => {
			const res = await fetch(generalApi + "/getCurrentPlayer");
			const body = await res.json();
			const data = body.msg;
			updateBalance();
			const playerImage = await getPlayerImageLink(data.id);
			setPlayerDetails({
				id: data.id,
				name: data.name,
				basePrice: data.basePrice,
				currentPrice: data.currentPrice,
				imgLink: playerImage.imgLink
			});
			setNextBid(data.nextBid);

			wsClient.onopen = () =>{
				setIsLive(()=> true);
				setInterval(() => {
					wsClient.send("ping");
				}, 50000);
			}
			wsClient.onclose = () =>{
				setIsLive(()=> false);
			}
			wsClient.onmessage = async (message) => {
				const msg = JSON.parse(message.data);
				const body = msg.body;
				const playerImage = await getPlayerImageLink(body.playerId);
				switch (msg.type) {
					case newPlayerListedType: {
						toast.success("New player is listed!");
						setBidderList([]);
						setPlayerDetails({
							id: body.playerId,
							name: body.playerName,
							basePrice: body.basePrice,
							currentPrice: body.currentPrice,
							imgLink: playerImage.imgLink
						});
						setNextBid(body.currentPrice);
						break;
					}
					case bidPlacedType: {
						setPlayerDetails((prev) => {
							if (prev.id === body.playerId) {
								setNextBid(body.nextPrice);
								return {
									...prev,
									currentPrice: body.amount,
								};
							} else {
								//get the latest user
								alert("Reload this page! Player is not up to date");
								return prev;
							}
						});
						setBidderList((prev) => {
							return [...prev, [body.bidderName, body.amount]];
						});
						break;
					}
					case newBidPriceType: {
						toast("New price is set");
						setPlayerDetails((prev) => {
							if (prev.id === body.playerId) setNextBid(body.nextPrice);
							else {
								alert("Reload this page! Player is not up to date");
							}
							return prev;
						});
						break;
					}
					case userBannedType: {
						toast(`${body.userName} is banned`);
						break;
					}
					case playerSoldType: {
						console.log("Body: ",{body});

						setIsOpen(() => {
							return {
								state: true,
								playerName: body.playerName,
								bidderName: body.bidderName,
								amount: body.amount,
							};
						});
						break;
					}
					case getControlType: {
						if (body.state === "START") toast.success("Bidding Resumed");
						if (body.state === "STOP") toast.error("Bidding Paused");
						break;
					}
				}
			};
		};
		main(wsClient);
		return(()=>{
			if(wsClient.readyState) {console.log("here");wsClient.close()};
		})
	}, []);
	// console.log(">_<");
	// console.log(playerDetails);
	if (playerDetails.id === "") return <NoPlayerListed isLive={isLive} userId={userId} />;
	return (
		<div className="max-w-screen h-screen flex flex-col items-center relative py-8 sm:py-0">
			<UserNavbar />
			<Toaster
				position="bottom-left"
				reverseOrder={false}
				gutter={8}
				containerClassName=""
				containerStyle={{}}
				toastOptions={{
					// Define default options
					className: "",
					duration: 5000,
					style: {
						background: "#9d4edd20",
						opacity: 50,
						backdropFilter: "blur(12px)",
						color: "#fff",
					},

					// Default options for specific types
					success: {
						duration: 3000,
						iconTheme: {
							primary: "green",
							secondary: "black",
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
			<LiveButton isLive={isLive}></LiveButton>
			<div className="h-full w-full flex flex-col items-center">
				<div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-8 mt-24 px-2">
					<div className="w-full h-full col-span-2">
				<div className="flex flex-col md:flex-row justify-end gap-x-6 gap-y-2 w-full sm:pr-8 my-2 font-inter">
					<div className="flex gap-6 justify-center">
					<p className="sm:text-xl">
					Welcome, {userName} 
					</p>
					<p className="sm:text-xl">
					Balance: Rs. {userBalance} Lakhs
					</p>
					</div>
					<button onClick={updateBalance} className="bg-primary px-4 py-1 text-sm rounded-sm w-fit self-center">Refresh Balance</button>
				</div>
					<SmallCard
						playerDetails={playerDetails}
						nextBid={nextBid}
						userId={userId}
						/>
					<LargeCard
						playerDetails={playerDetails}
						nextBid={nextBid}
						userId={userId}
						/>
						</div>
					<div className="w-screen sm:w-full flex justify-center mb-8 sm:mb-0">
						<LeaderBoard bidderList={bidderList}></LeaderBoard>
					</div>
				</div>
			</div>
		</div>
	);
}


