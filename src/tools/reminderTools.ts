import { Tool, Reminder } from '@/interfaces';
import { ReminderRepository } from '@/repositories/ReminderRepository';

const reminderRepository = new ReminderRepository();

const createReminderTool: Tool = {
    name: 'createReminder',
    description: 'Create a reminder with a title, description, and date (assume the date or ask for the user).',
    execute: async (input: Reminder): Promise<Reminder> => {
        return reminderRepository.createReminder(input);
    },
};

const deleteRemindersTool: Tool = {
    name: 'deleteReminders',
    description: 'Delete all reminders.',
    execute: async (): Promise<string> => {
        return reminderRepository.deleteReminders();
    },
};

const getRemindersTool: Tool = {
    name: 'getReminders',
    description: 'Get all reminders.',
    execute: async (): Promise<Reminder[]> => {
        return reminderRepository.getReminders();
    },
};

const updateReminderTool: Tool = {
    name: 'updateReminder',
    description: 'Update a reminder with the id, title, description, and date.',
    execute: async (input: Reminder): Promise<Reminder> => {
        return reminderRepository.updateReminder(input);
    },
};

export default [createReminderTool, deleteRemindersTool, getRemindersTool, updateReminderTool];