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
		<div className="fixed inset-0 flex items-center justify-center bg-primary">
			<div className="bg-primary rounded-sm shadow-lg p-6 max-w-sm mx-auto text-center font-inter">
				<h2 className="text-2xl font-bold text-white mb-2">
					🎉 Player Sold! 🎉
				</h2>
				<p className="text-gray-300">
					Player Name: <span className="text-white">{playerName}</span>
				</p>
				<p className="text-gray-300">
					Bidder Name: <span className="text-white">{bidderName}</span>
				</p>
				<p className="text-gray-300">
					Selling Amount: <span className="text-white">${sellingAmount}</span>
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