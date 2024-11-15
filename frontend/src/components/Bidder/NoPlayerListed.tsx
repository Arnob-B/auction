import Image from "next/image";
import UserNavbar from "@/components/UserNavbar";
import LiveButton from "./LiveButton";
import React, {useState} from "react";
import getCachedBalance from "@/app/Bidder/getCachedBalance";
import CountdownTimer from "../clock/CountdownClock";


function NoPlayerListed({isLive, userId}:{isLive:boolean, userId:string}){
    // const [isLive, setIsLive] = useState<boolean>(false);
    const [userBalance, setUserBalance] = useState<number>(0);
    const targetTime = new Date("2024-11-15T18:30:00"); 


    const updateBalance = () => {
        getCachedBalance(userId)
            // .then((res) => res.json())
            .then((res) => res && setUserBalance(res.balance));
    };

	return(
    <div className='h-screen w-screen grid place-items-center relative'>
        <LiveButton isLive={isLive}/>
		<UserNavbar />
        <div className='text-center flex flex-col items-center gap-y-4 font-inter sm:mt-8 h-full pt-4 sm:pt-0 sm:h-auto'>
        <CountdownTimer targetDate={targetTime}/>
            <div className='hidden sm:flex flex-col items-center justify-center sm:flex-row sm:gap-12 h-1/2'>
                <Image src="/esummit-logo.png" alt='E-Summit Logo' width={240} height={110} className='h-auto my-4'/>
                <Image src="/mock-ipl-logo.png" alt='Mock IPL Logo' width={240} height={150}/>
            </div>
            <div className='flex sm:hidden flex-col items-center justify-center sm:flex-row sm:gap-12 mt-6'>
                <Image src="/esummit-logo.png" alt='E-Summit Logo' width={240} height={110} className='h-auto my-4'/>
                <Image src="/mock-ipl-logo.png" alt='Mock IPL Logo' width={240} height={150}/>
            </div>
            <div className="flex flex-col sm:flex-row gap-x-4 gap-y-2">
            <h1 className="font-opensans text-primary">Your Balance: Rs. {userBalance} Lakhs</h1>
            <button onClick={updateBalance} className="bg-primary px-4 py-1 text-sm rounded-sm w-fit self-center">Refresh Balance</button>
            </div>
            
            <h1 className='text-4xl font-semibold text-primary break-words'>No Player Listed Currently.</h1>
            <div className='sm:text-lg text-accent font-opensans'>
            <h2>Please wait till the next player is listed!</h2>
            </div>
        </div>
    </div>
	)
}

export default NoPlayerListed;