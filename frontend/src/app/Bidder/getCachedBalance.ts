"use server";
// import { unstable_cache } from "next/cache";
import { prisma } from "@/utils/db";

// const getCachedBalance = unstable_cache(
// 	(userId: string) => {
// 		// const balance = fetch(`/api/user/getBalance/${userId}`);
//         console.log("revalidating balance");
// 		const balance = prisma.user.findFirst({
// 			where: {
// 				id: userId,
// 			},
// 			select: {
// 				balance: true,
// 			},
// 		});
// 		return balance;
// 	},
// 	[],
// 	{ revalidate: 30 }
// );

const getCachedBalance = (userId:string) => {
	const balance = prisma.user.findFirst({
		where: {
			id: userId
		},
		select: {
			balance: true
		}
	})
	return balance;
}

export default getCachedBalance;
