'use server'
import MyTeam from "./ClientCode"
import { redirect } from 'next/navigation';
import { auth } from '@/auth'
import { unstable_cache } from "next/cache";
import {prisma} from "@/utils/db";


export type playersType = {
  id : string,
  name:string,
  imgLink : string,
  basePrice : number,
  sellingPrice:number
}

const getCachedPurchases = unstable_cache(async (userId:string)=>{
  const purchases = prisma.player.findMany({
    where: {
      ownerId: userId
    },
    select: {
      id: true,
      name: true,
      imgLink: true,
      basePrice: true,
      sellingPrice: true
  }})
  return purchases;
},[],{revalidate:30});

export default async function  Page(){
	const session = await auth();
  if(!session || !session.user || !session.user.id) redirect("/");

  const players:playersType[] = await getCachedPurchases(session.user.id);

  return (
    <div>
      <MyTeam players={players} />
    </div>
  )
}