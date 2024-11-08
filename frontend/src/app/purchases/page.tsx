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
  const players:Array<playersType> = [
    {
      id:1,
      name:"test",
      imgLink:"test",
      basePrice:200,
      sellingPrice:300
    },
    {
      id:2,
      name:"kaka",
      imgLink:"test",
      basePrice:200,
      sellingPrice:300
    },
    {
      id:3,
      name:"mama",
      imgLink:"test",
      basePrice:200,
      sellingPrice:300
    },
  ]

	if(!session || !session.user || !session.user.id || !session.user.name) redirect("/");

  return (
    <div>
      <MyTeam players={players}></MyTeam>
    </div>
  )
}