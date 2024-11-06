const AlertBox = ({
	playerName,
	bidderName,
	sellingAmount,
	onClose,
}: {
	playerName: string;
	bidderName: string;
	sellingAmount: number;
	onClose: ()=>void;
}) => {
	return (
		<div className="fixed inset-0 flex items-center justify-center">
			<div className="bg-gradient-to-tr from-gray-300/10 to-gray-300/20 backdrop-blur-lg rounded-lg shadow-lg p-6 max-w-md mx-auto text-center text-lg font-opensans">
				<h2 className="text-4xl font-bold font-inter text-white mb-2">
					🎉 Player Sold! 🎉
				</h2>
				<p className="text-gray-300 ">
					Player Name: <span className="text-white">{playerName}</span>
				</p>
				<p className="text-gray-300 my-3">
					Bidder Name: <span className="text-white">{bidderName}</span>
				</p>
				<p className="text-gray-300">
					Selling Amount: <span className="text-white">&#8377;{sellingAmount} Lakhs</span>
				</p>
				<button
					className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-500 transition"
					onClick={onClose}>
					Close
				</button>
			</div>
		</div>
	);
};

export default AlertBox;