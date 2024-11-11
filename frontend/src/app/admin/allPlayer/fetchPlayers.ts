'use server';
import {prisma} from "@/utils/db";
import { revalidatePath } from "next/cache";

const fetchPlayers = async () => {
    const players = await prisma.player.findMany();
    revalidatePath("/admin/allPlayer");
    return players;
}

export default fetchPlayers;