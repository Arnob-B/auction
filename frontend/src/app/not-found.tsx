import Image from 'next/image'
import React from 'react'

function NotFound() {
  return (
    <div className='h-screen w-screen grid place-items-center'>
        <div className='text-center flex flex-col gap-y-8 font-inter'>
            <div className='flex flex-col items-center justify-center sm:flex-row sm:gap-12'>
                <Image src="/esummit-logo.png" alt='E-Summit Logo' width={240} height={110} className='h-auto my-4 mt-7'/>
                <Image src="/mock-ipl-logo.png" alt='Mock IPL Logo' width={240} height={150}/>
            </div>
            <h1 className='text-4xl sm:text-5xl font-semibold text-primary'>Page Not Found</h1>
            <div className='sm:text-lg text-accent font-opensans'>
            <h2>Oops! There was an error.</h2>
            <h2>Please check the URL you entered.</h2>
            </div>
        </div>
    </div>
  )
}

export default NotFound