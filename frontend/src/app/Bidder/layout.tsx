// app/layout.tsx
import React, { ReactNode } from 'react';
import CountdownTimer from '../../components/clock/CountdownClock';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const targetTime = new Date("2024-11-15T18:30:00"); 
  return (
    <div className="flex flex-col items-center">
        <CountdownTimer targetDate={targetTime}></CountdownTimer>
        <div className=''>
        {children}
        </div>
    </div>
  );
};

export default Layout;
