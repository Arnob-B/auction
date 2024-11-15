"use client";

import React, { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false); // Track if it's client-side render

  // Function to calculate the time difference
  function calculateTimeLeft() {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return {
      days: Math.max(days, 0),
      hours: Math.max(hours, 0),
      minutes: Math.max(minutes, 0),
      seconds: Math.max(seconds, 0),
    };
  }

  // Only start the countdown timer after the component has mounted on the client
  useEffect(() => {
    setIsClient(true); // Set state to indicate client-side rendering
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval); // Clean up interval on unmount
  }, [targetDate]);

  // If it's still SSR (initial render), return null to avoid mismatch
  if (!isClient) {
    return null;
  }

  return (
    <>
    <div className="hidden sm:grid grid-flow-col grid-cols-3 gap-5 text-center auto-cols-max">
      {/* <TimeUnit label="days" value={timeLeft.days} /> */}
      <TimeUnit label="Hours" value={timeLeft.hours} />
      <TimeUnit label="Minutes" value={timeLeft.minutes} />
      <TimeUnit label="Seconds" value={timeLeft.seconds} />
    </div>
    <div className="pl-16 grid sm:hidden grid-flow-col grid-cols-3 gap-5 text-right auto-cols-max">
      {/* <TimeUnit label="days" value={timeLeft.days} /> */}
      <TimeUnit label="H" value={timeLeft.hours} />
      <TimeUnit label="M" value={timeLeft.minutes} />
      <TimeUnit label="S" value={timeLeft.seconds} />
    </div>
    </>
  );
};

interface TimeUnitProps {
  label: string;
  value: number;
}

const TimeUnit: React.FC<TimeUnitProps> = ({ label, value }) => {
  return (
    <div className="flex flex-col p-2 px-4 sm:p-4 bg-white/20 rounded-xl shadow-lg backdrop-blur-lg text-white w-full">
      <span className="font-mono sm:text-3xl">{value}</span>
      <span className="text-sm sm:mt-2 opacity-70">{label}</span>
    </div>
  );
};

export default CountdownTimer;
