import { Tool } from '@/interfaces';
import { ReminderRepository } from '@/repositories/ReminderRepository';

const reminderRepository = new ReminderRepository();

export const deleteRemindersTool: Tool = {
    name: 'deleteReminders',
    description: 'Delete all reminders.',
    execute: async (): Promise<string> => {
        return reminderRepository.deleteReminders();
    },
};