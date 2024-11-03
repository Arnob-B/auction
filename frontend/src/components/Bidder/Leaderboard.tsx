export default function LeaderBoard({ bidderList }: { bidderList: [string, number][] }) {
	return (
		<div className="bg-gradient-to-tr from-white/5 via-white/5 to-white/10 backdrop-blur-md rounded-lg shadow-lg overflow-hidden mt-6">
			<div className="p-4 border-b border-gray-700">
				<h2 className="text-xl font-semibold font-inter text-white text-center">
					Bidding Leaderboard
				</h2>
			</div>
			<ul className="divide-y divide-gray-700 flex flex-col-reverse font-opensans">
				{bidderList.map((e, ind) => {
					return (
						<li key={ind} className="flex justify-between items-center p-4">
							<span className="text-white">{e[0]}</span>
							<span className="text-green-400 font-bold">{e[1]}</span>
						</li>
					);
				})}
			</ul>
		</div>
	);
}