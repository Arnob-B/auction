import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export async function GET(req: NextRequest, {params}: {params: {id:string}}) {
	try {
        const {id} = params;
		const players = await prisma.player.findMany({
            where: {
                ownerId: id
            },
            select: {
                id: true,
                name: true,
                imgLink: true,
                basePrice: true,
                sellingPrice: true
            }
        })

        return NextResponse.json(players);

	} catch (error) {
        console.log(error);
        return NextResponse.json({error});
    }
}
