import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import OpenAI from 'openai';

const openai = new OpenAI();

type Message = {
    role: 'system' | 'user' | 'assistant';
    content: string;
};

type Reminder = {
    title: string;
    description: string;
    date: Date;
};

const generateSystemPrompt = (toolsDescription: string, iteration: number): string => `
You are an AI assistant that can help manage reminders. You always answer questions in portuguese.

You have access to the following tools:

${toolsDescription}

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: [action_name]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)

Thought: I now know the final answer
Answer: the final answer to the original input question

This is iteration number ${iteration} of a maximum of 10.

Begin!
`;

async function createReminder({ title, description, date }: Reminder) {
    const reminder = await prisma.reminder.create({
        data: {
            title,
            description,
            date: new Date(date),
        },
    });

    return reminder;
}

async function getReminders() {
    const reminders = await prisma.reminder.findMany();
    return reminders;
}

async function deleteReminders() {
    await prisma.reminder.deleteMany();
    return 'Reminders deleted successfully.';
}

export async function POST(request: NextRequest) {
    try {
        const { userInput, conversationHistory } = await request.json();

        const toolsDescription = `
- createReminder: create a reminder with a title, description, and date. You should use getReminders to see the reminders and avoid duplicates.
- getReminders: get all reminders
- deleteReminders: delete all reminders
`;

        let messages: Message[] = [
            { role: 'system', content: generateSystemPrompt(toolsDescription, 1) },
            { role: 'user', content: `Question: ${userInput}` },
        ];

        let assistantResponse = '';
        let actionLoop = true;
        let iteration = 1;

        while (actionLoop && iteration <= 10) {
            const completion = await openai.chat.completions.create({
                messages: messages,
                model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
                temperature: 0,
                max_tokens: 150,
                stop: ['Observation:'],
            });

            assistantResponse = completion.choices[0].message?.content?.trim() || '';
            messages.push({ role: 'assistant', content: assistantResponse });

            if (assistantResponse.includes('Answer:')) {
                actionLoop = false;
            } else if (assistantResponse.includes('Action:')) {
                const { actionName, actionInput } = parseAction(assistantResponse);
                const observation = await executeAction(actionName, actionInput);
                messages.push({ role: 'user', content: `Observation: ${observation}` });
            } else {
                // Continue the loop if the assistant is reasoning
                continue;
            }

            iteration++;
            if (iteration <= 10) {
                messages[0].content = generateSystemPrompt(toolsDescription, iteration);
            }
        }

        const userVisibleResponse = extractAnswer(assistantResponse);

        return NextResponse.json({ userVisibleResponse, conversationHistory: messages });
    } catch (error) {
        console.error('Error in POST handler:', error);
        return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
    }
}

function parseAction(assistantMessage: string): { actionName: string; actionInput: string } {
    const actionRegex = /Action:\s*(.*)/;
    const actionInputRegex = /Action Input:\s*(.*)/;

    const actionMatch = assistantMessage.match(actionRegex);
    const actionInputMatch = assistantMessage.match(actionInputRegex);

    const actionName = actionMatch ? actionMatch[1].trim() : '';
    const actionInput = actionInputMatch ? actionInputMatch[1].trim() : '';

    return { actionName, actionInput };
}

async function executeAction(actionName: string, actionInput: string): Promise<string> {
    switch (actionName) {
        case 'createReminder':
            try {
                const { title, description, date } = JSON.parse(actionInput);
                await createReminder({ title, description, date });
                return 'Reminder created successfully.';
            } catch (error) {
                console.error('Error executing createReminder:', error);
                return 'Failed to create reminder. Please check the input format.';
            }
        case 'getReminders':
            try {
                const reminders = await getReminders();
                return JSON.stringify(reminders);
            } catch (error) {
                console.error('Error executing getReminders:', error);
                return 'Failed to retrieve reminders.';
            }
        case 'deleteReminders':
            try {
                const response = await deleteReminders();
                return response;
            } catch (error) {
                console.error('Error executing deleteReminders:', error);
                return 'Failed to delete reminders.';
            }
        default:
            return 'Unknown action';
    }
}

function extractAnswer(assistantResponse: string): string {
    const answerRegex = /Answer:\s*([\s\S]*)/;
    const match = assistantResponse.match(answerRegex);
    if (match) {
        return match[1].trim();
    } else {
        // If 'Answer:' is not found, return an empty string or a default message
        return '';
    }
}
