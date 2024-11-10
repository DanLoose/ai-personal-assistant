import prisma from '../../lib/prisma';
import { Reminder } from '@/interfaces';

export class ReminderRepository {
    async createReminder({ title, description, date }: Reminder): Promise<Reminder> {
        const reminder = await prisma.reminder.create({
            data: {
                title,
                description,
                date: new Date(date),
            },
        });

        return reminder;
    }

    async getReminders(): Promise<Reminder[]> {
        const reminders = await prisma.reminder.findMany();
        return reminders;
    }

    async updateReminder({ id, title, description, date }: Reminder): Promise<Reminder> {
        const reminder = await prisma.reminder.update({
            where: { id },
            data: {
                title,
                description,
                date: new Date(date),
            },
        });

        return reminder;
    }

    async deleteReminders(): Promise<string> {
        await prisma.reminder.deleteMany();
        return 'Reminders deleted successfully.';
    }
}
