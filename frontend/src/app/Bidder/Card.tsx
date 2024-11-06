import Image from "next/image";

type playerDetailsType = {
	id: string;
	name: string;
	basePrice: number;
	currentPrice: number;
	imgLink: string;
};

export default function Card({ playerDetails }: { playerDetails: playerDetailsType }) {
	// const [playerStats,setPlayerStats] = useState();
	return (
		<div className="max-w-xs mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
			{/* <img
				className="w-full h-48 object-cover"
				src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/C._Ronaldo_-_Ballon_d%27Or_2014.jpg/261px-C._Ronaldo_-_Ballon_d%27Or_2014.jpg"
				alt={`${playerDetails.name} Image`}
			/> */}
			<Image src={playerDetails.imgLink} alt={`${playerDetails.name} Image`} width={400} height={400} className="w-full h-48 object-cover"/>
			<div className="p-4">
				<h2 className="text-xl font-bold text-white">{playerDetails.name}</h2>
				<p className="text-gray-300"></p>
				<div className="mt-4">
					<span className="text-lg font-semibold text-white">Base Price:</span>
					<span className="text-lg font-bold text-green-400">
						{playerDetails.basePrice}
					</span>
				</div>
				<div className="mt-4">
					<span className="text-lg font-semibold text-white">
						currentPrice Price:
					</span>
					<span className="text-lg font-bold text-green-400">
						{playerDetails.currentPrice}
					</span>
				</div>
			</div>
		</div>
	);
}