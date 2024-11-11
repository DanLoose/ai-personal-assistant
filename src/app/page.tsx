import prisma from '@/lib/prisma';

export default async function Home() {
  let data = await prisma.reminder.findMany();

  return (
    <>

    </>
  )
}