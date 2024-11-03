function LiveButton({ isLive }:{isLive:boolean}) {
    return (
      <button
        className={`px-6 py-2 font-bold text-white rounded-md  fixed top-6 left-6 font-opensans
          ${isLive ? 'bg-red-500 neon-shadow' : 'bg-gray-400/40'}
        `}
        style={{
          transition: 'all 0.3s ease-in-out',
        }}
      >
        {isLive ? 'LIVE' : 'OFFLINE'}
        <style jsx>{`
          .neon-shadow {
            box-shadow: 
              0 0 5px #ff1a1a, 
              0 0 10px #ff1a1a, 
              0 0 20px #ff1a1a;
          }
        `}</style>
      </button>
    );
  }

  export default LiveButton;