import { Tool } from "@/interfaces";
import { Reminder } from "@/interfaces";
import { ReminderRepository } from "@/repositories/ReminderRepository";

const reminderRepository = new ReminderRepository();

export const getRemindersTool: Tool = {
    name: 'getReminders',
    description: 'Get all reminders.',
    execute: async (): Promise<Reminder[]> => {
        return reminderRepository.getReminders();
    },
};