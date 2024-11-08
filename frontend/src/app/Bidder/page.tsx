import { auth } from '@/auth'
import { redirect } from 'next/navigation';
import React from 'react'
import ClientCode from './ClientCode';

async function page() {
	const session = await auth();
	// console.log({session});
	if(!session || !session.user || !session.user.id || !session.user.name) redirect("/");
  return (
	<ClientCode userId={session.user.id} userName={session.user.name} />
  )
}

export default page