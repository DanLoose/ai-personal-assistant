// app/api/reminders/route.ts

import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  const reminders = await prisma.reminder.findMany();
  return NextResponse.json(reminders);
}

export async function POST(request: Request) {
  const { title, description, date } = await request.json();

  if (!title || !date) {
    return NextResponse.json({ error: 'Title and date are required' }, { status: 400 });
  }

  const reminder = await prisma.reminder.create({
    data: {
      title,
      description,
      date: new Date(date),
    },
  });

  return NextResponse.json(reminder, { status: 201 });
}
