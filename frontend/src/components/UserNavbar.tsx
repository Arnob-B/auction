import React from 'react'
import Link from 'next/link'

function UserNavbar() {
  return (
    <nav className='absolute top-20 sm:top-10 font-opensans px-6 py-3 text-accent rounded-full text-sm backdrop-blur-md bg-gradient-to-bl from-white/10 via-white/10 to-white/15 flex gap-x-6 transition-colors'>
      <Link href="/Bidder" className='hover:text-primary'>Bidding</Link>
      <Link href="/leaderboard" className='hover:text-primary'>Leaderboard</Link>
      <Link href="/purchases" className='hover:text-primary'>Your Players</Link>
    </nav>
  )
}

export default UserNavbar