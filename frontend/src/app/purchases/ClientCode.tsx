"use client"
import './style.css'
import React, { useState, useEffect } from 'react';
import { AiOutlineLeft, AiOutlineRight, AiOutlinePlayCircle, AiOutlinePauseCircle } from 'react-icons/ai';
import NoPlayersBought from './NoPlayersBought';

import { playersType } from './page';

export default function MyTeam({userId}:{userId:string}) {
  const [players, setPlayers] = useState<Array<playersType>>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [flipDirection, setFlipDirection] = useState<string|null>(null); // Track direction (left or right)
  const [isFlipping, setIsFlipping] = useState(false);
  
  useEffect(()=>{
    fetch (`/api/user/purchases/${userId}`)
    .then(res=>res.json())
    .then(res=>setPlayers(res))
    .catch(err=>console.log(err));
  },[userId])


  // Carousel auto-play effect
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        handleNext();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, currentPlayerIndex]);
  
  if(players.length===0) return <NoPlayersBought />

  const handleNext = () => {
    setFlipDirection('right'); // New card enters from the right, exit is to the left
    triggerFlipAnimation(() => {
      setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
    });
  };

  const handlePrevious = () => {
    setFlipDirection('left'); // New card enters from the left, exit is to the right
    triggerFlipAnimation(() => {
      setCurrentPlayerIndex((prevIndex) => (prevIndex - 1 + players.length) % players.length);
    });
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const triggerFlipAnimation = (callback:()=>void) => {
    setIsFlipping(true);
    setTimeout(() => {
      callback();
      setTimeout(() => setIsFlipping(false), 500); // Ensure the new card appears after flip
    }, 250); // Delay matches the first flip-out phase
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-white p-4">
      <h1 className="text-4xl font-bold mb-8 text-purple-100">My Team</h1>

      {/* Player Card with Flip Animation */}
      <div
        className={`relative flex items-center justify-center h-96 w-80 bg-purple-200 bg-opacity-30 backdrop-blur-lg rounded-xl p-6 transition-transform duration-500
          ${isFlipping ? `animate-flip-${flipDirection}` : ''}
        `}
      >
        <div className="text-center">
          <img src={players[currentPlayerIndex].imgLink} alt={`${players[currentPlayerIndex].name} Photo`} className='w-auto h-auto' />
          <h2 className="text-2xl font-semibold text-purple-100">{players[currentPlayerIndex].name}</h2>
          <p className="text-lg text-purple-200">Base Price: {players[currentPlayerIndex].basePrice}</p>
          <p className="text-lg text-purple-200">Purchase Price: {players[currentPlayerIndex].sellingPrice}</p>
        </div>
      </div>

      {/* Carousel Controls */}
      <div className="flex items-center mt-8 space-x-4">
        <button
          onClick={handlePrevious}
          className="p-3 rounded-full bg-purple-700 bg-opacity-60 hover:bg-purple-600 transition-transform transform hover:scale-110"
        >
          <AiOutlineLeft className="text-2xl text-purple-100" />
        </button>

        <button
          onClick={togglePlay}
          className="p-3 rounded-full bg-purple-700 bg-opacity-60 hover:bg-purple-600 transition-transform transform hover:scale-110"
        >
          {isPlaying ? (
            <AiOutlinePauseCircle className="text-2xl text-purple-100" />
          ) : (
            <AiOutlinePlayCircle className="text-2xl text-purple-100" />
          )}
        </button>

        <button
          onClick={handleNext}
          className="p-3 rounded-full bg-purple-700 bg-opacity-60 hover:bg-purple-600 transition-transform transform hover:scale-110"
        >
          <AiOutlineRight className="text-2xl text-purple-100" />
        </button>
      </div>
    </div>
  );
}
