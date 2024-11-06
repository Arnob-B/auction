"use server";
import { prisma } from "@/utils/db";

async function getPlayerImageLink(playerId: string) {
	const playerImg = (await prisma.player.findFirst({
		select: {
			imgLink: true,
		},
		where: { id: playerId },
	})) ?? {
		imgLink: "https://www.iplt20.com/assets/images/default-headshot.png",
	};
	return playerImg;
}

export default getPlayerImageLink;
