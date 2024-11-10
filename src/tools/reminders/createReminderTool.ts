import { Tool, Reminder } from '@/interfaces';
import { ReminderRepository } from '@/repositories/ReminderRepository';

const reminderRepository = new ReminderRepository();

export const createReminderTool: Tool = {
    name: 'createReminder',
    description: 'Create a reminder with a title, description, and date (assume the date or ask for the user).',
    execute: async (input: Reminder): Promise<Reminder> => {
        return reminderRepository.createReminder(input);
    },
};
