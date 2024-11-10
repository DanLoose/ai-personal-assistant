import { Tool, Expense } from '@/interfaces';
import { ExpensesRepository } from '@/repositories/ExpensesRepository';

const expensesRepository = new ExpensesRepository();

const createExpenseTool: Tool = {
    name: 'createExpense',
    description: 'Create an expense with an amount, description, date, and category (assume the date or ask for the user).',
    input: JSON.stringify({
        type: 'object',
        properties: {
            amount: { type: 'number' },
            description: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            category: { type: 'string' }
        },
        required: ['amount', 'description', 'date', 'category']
    }),
    execute: async (input: Expense): Promise<Expense> => {
        return expensesRepository.createExpense(input);
    },
};

const deleteExpensesTool: Tool = {
    name: 'deleteExpenses',
    description: 'Delete all expenses.',
    input: JSON.stringify({ type: 'null' }),
    execute: async (): Promise<string> => {
        return expensesRepository.deleteExpenses();
    },
};

const getExpensesByDateTool: Tool = {
    name: 'getExpensesByDate',
    description: 'Get all expenses by date.',
    input: JSON.stringify({
        type: 'object',
        properties: {
            date: { type: 'string', format: 'date-time' }
        },
        required: ['date']
    }),
    execute: async (input: { date: string }): Promise<Expense[]> => {
        return expensesRepository.getExpensesByDate(new Date(input.date));
    },
};

const getExpensesByAmountTool: Tool = {
    name: 'getExpensesByAmount',
    description: 'Get all expenses by amount.',
    input: JSON.stringify({
        type: 'object',
        properties: {
            amount: { type: 'number' }
        },
        required: ['amount']
    }),
    execute: async (input: { amount: number }): Promise<Expense[]> => {
        const expenses = await expensesRepository.getExpensesByAmount(input.amount);
        return expenses;
    },
};

const getExpensesByCategoryTool: Tool = {
    name: 'getExpensesByCategory',
    description: 'Get all expenses by category.',
    input: JSON.stringify({
        type: 'object',
        properties: {
            category: { type: 'string' }
        },
        required: ['category']
    }),
    execute: async (input: { category: string }): Promise<Expense[]> => {
        return expensesRepository.getExpensesByCategory(input.category);
    },
};

const getExpensesTool: Tool = {
    name: 'getExpenses',
    description: 'Get all expenses.',
    input: JSON.stringify({ type: 'null' }),
    execute: async (): Promise<Expense[]> => {
        return expensesRepository.getExpenses();
    },
};

const updateExpenseTool: Tool = {
    name: 'updateExpense',
    description: 'Update an expense with an amount, description, date, and category (assume the date or ask for the user).',
    input: JSON.stringify({
        type: 'object',
        properties: {
            id: { type: 'string' },
            amount: { type: 'number' },
            description: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            category: { type: 'string' }
        },
        required: ['id', 'amount', 'description', 'date', 'category']
    }),
    execute: async (input: Expense): Promise<Expense> => {
        return expensesRepository.updateExpense(input);
    },
};

export default [createExpenseTool, deleteExpensesTool, getExpensesByDateTool, getExpensesByAmountTool, getExpensesByCategoryTool, getExpensesTool, updateExpenseTool];