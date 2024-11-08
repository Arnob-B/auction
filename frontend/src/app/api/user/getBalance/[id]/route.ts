import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export async function GET(req: NextRequest, {params}: {params: {id:string}}) {
	try {
        const {id} = params;
		const { balance } = (await prisma.user.findFirst({
			where: {
				id
			},
			select: {
				balance: true,
			},
		})) ?? { balance: 0 };

		return NextResponse.json({ balance });
	} catch (error) {
        console.log(error);
        throw error;
    }
}
