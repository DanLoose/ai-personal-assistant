import { Tool } from '@/interfaces';
import { Reminder } from '@/interfaces';
import { ReminderRepository } from '@/repositories/ReminderRepository';

const reminderRepository = new ReminderRepository();

export const updateReminderTool: Tool = {
    name: 'updateReminder',
    description: 'Update a reminder with the id, title, description, and date.',
    execute: async (input: Reminder): Promise<Reminder> => {
        return reminderRepository.updateReminder(input);
    },
};