import { prisma } from "@/utils/db";
import { unstable_cache } from "next/cache";

function LeaderBoard({
	bidderList,
}: {
	bidderList: { name: string; points: number }[];
}) {
	return (
		<div className="overflow-visible pt-6 w-full flex justify-center">
			<div className="bg-gradient-to-tr from-white/5 via-white/5 to-white/10 backdrop-blur-md rounded-lg shadow-lg max-h-[77vh] w-[90%] md:w-[75%] lg:w-[50%]">
				<div className="p-4 border-b border-gray-700">
					<h2 className="text-xl font-semibold font-inter text-white text-center">
						Leaderboard
					</h2>
				</div>
				<ul className="divide-y divide-gray-700 flex flex-col font-opensans relative">
					{bidderList.map((e, ind) => (
						<li
							key={ind}
							className="flex justify-between items-center p-4 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-white/10 hover:shadow-xl rounded-lg cursor-pointer relative hover:-translate-y-2 hover:z-10">
							<span className="text-gray-300 font-bold">#{ind + 1}</span>
							{/* Rank */}
							<span className="text-white text-center flex-1">{e.name}</span>
							{/* Name */}
							<span className="text-green-400 font-bold">{e.points}</span>
							{/* Points */}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

const getCachedLeaderboard = unstable_cache(
  ()=>{
    console.log("revalidating");
    const users = prisma.user.findMany({
      where: {
        points: {
          not: 0,
        },
      },
      select: {
        name: true,
        points: true,
      },
    });;
    return users;
  },[],{revalidate: 30}
);

export default async function Page() {
	console.log("got hit");
	try {
		const res: Array<{ name: string; points: number }> | null = await getCachedLeaderboard();
			// await prisma.user.findMany({
			// 	where: {
			// 		points: {
			// 			not: 0,
			// 		},
			// 	},
			// 	select: {
			// 		name: true,
			// 		points: true,
			// 	},
			// });
		if (res) {
			res.sort((ob1, ob2) => {
				return ob2.points - ob1.points;
			}); //descending order sort
			return (
				<div>
					<LeaderBoard bidderList={res}></LeaderBoard>
				</div>
			);
		}
		return <>No leaderBoard</>;
	} catch (err) {
		console.log(err);
		return <>No leaderBoard</>;
	}
}
