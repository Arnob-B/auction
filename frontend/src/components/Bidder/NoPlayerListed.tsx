import Image from "next/image";
import UserNavbar from "@/components/UserNavbar";
import LiveButton from "./LiveButton";
import React, {useState} from "react";
import getCachedBalance from "@/app/Bidder/getCachedBalance";


function NoPlayerListed({isLive, userId}:{isLive:boolean, userId:string}){
    // const [isLive, setIsLive] = useState<boolean>(false);
    const [userBalance, setUserBalance] = useState<number>(0);

    const updateBalance = () => {
        getCachedBalance(userId)
            // .then((res) => res.json())
            .then((res) => res && setUserBalance(res.balance));
    };

	return(
    <div className='h-screen w-screen grid place-items-center relative'>
        <LiveButton isLive={isLive}/>
		<UserNavbar />
        <div className='text-center flex flex-col items-center gap-y-4 sm:gap-y-8 font-inter'>
            <div className='flex flex-col items-center justify-center sm:flex-row sm:gap-12'>
                <Image src="/esummit-logo.png" alt='E-Summit Logo' width={240} height={110} className='h-auto my-4 mt-7'/>
                <Image src="/mock-ipl-logo.png" alt='Mock IPL Logo' width={240} height={150}/>
            </div>
            <div className="flex flex-col sm:flex-row gap-x-4 gap-y-2">
            <h1 className="font-opensans text-primary">Your Balance: Rs. {userBalance} Lakhs</h1>
            <button onClick={updateBalance} className="bg-primary px-4 py-1 text-sm rounded-sm w-fit self-center">Refresh Balance</button>
            </div>
            
            <h1 className='text-4xl sm:text-5xl font-semibold text-primary break-words'>No Player Listed Currently.</h1>
            <div className='sm:text-lg text-accent font-opensans'>
            <h2>Please wait till the next player is listed!</h2>
            </div>
        </div>
    </div>
	)
}

export default NoPlayerListed;