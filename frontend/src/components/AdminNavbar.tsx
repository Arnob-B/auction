import React from 'react'
import Link from 'next/link'

function AdminNavbar() {
  return (
    <nav className='absolute top-7 font-opensans px-6 py-3 text-accent rounded-full text-sm backdrop-blur-md bg-gradient-to-bl from-white/10 via-white/10 to-white/15 flex gap-x-6 transition-colors'>
      <Link href="/admin" className='hover:text-primary'>Bidding Control</Link>
      <Link href="/admin/allPlayer" className='hover:text-primary'>All Players</Link>
      <Link href="/admin/stats" className='hover:text-primary'>Statistics</Link>
      <Link href="/leaderboard" className='hover:text-primary'>Leaderboard</Link>
    </nav>
  )
}

export default AdminNavbar