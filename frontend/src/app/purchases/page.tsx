'use server'
import MyTeam from "./ClientCode"
import { redirect } from 'next/navigation';
import { auth } from '@/auth'


export type playersType = {
  id : number,
  name:string,
  imgLink : string,
  basePrice : number,
  sellingPrice:number
}
export default async function  Page(){
	const session = await auth();
  if(!session || !session.user || !session.user.id) redirect("/");

  return (
    <div>
      <MyTeam userId={session.user.id} />
    </div>
  )
}