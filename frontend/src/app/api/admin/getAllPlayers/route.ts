import { NextResponse } from "next/server";
import {prisma} from "@/utils/db";

export async function GET(){
    try {
        const players = await prisma.player.findMany();
        return NextResponse.json(players);
    } catch (error) {
        console.error(error);
        return NextResponse.json(error, {status: 500});
    }
}