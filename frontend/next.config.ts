
const nextConfig= {
  /* config options here */
	 images: {
    remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.sofifa.net',
				port: '',
				pathname: '/players/**',
			}
    ],
  },
};

export default nextConfig;
