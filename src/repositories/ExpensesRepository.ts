import prisma from '../lib/prisma';
import { Expense } from '@/interfaces';

export class ExpensesRepository {
    async createExpense({ amount, description, date, category }: Expense): Promise<Expense> {
        const expense = await prisma.expense.create({
            data: {
                amount,
                description,
                date: new Date(date),
                category,
            },
        });

        return expense;
    }

    async getExpenses(): Promise<Expense[]> {
        const expenses = await prisma.expense.findMany();
        return expenses;
    }

    async updateExpense({ id, amount, description, date, category }: Expense): Promise<Expense> {
        const expense = await prisma.expense.update({
            where: { id },
            data: {
                amount,
                description,
                date: new Date(date),
                category,
            },
        });

        return expense;
    }

    async deleteExpenses(): Promise<string> {
        await prisma.expense.deleteMany();
        return 'Expenses deleted successfully.';
    }

    async getExpensesByCategory(category: string): Promise<Expense[]> {
        const expenses = await prisma.expense.findMany({
            where: {
                category,
            },
        });

        return expenses;
    }

    async getExpensesByDate(date: Date): Promise<Expense[]> {
        const expenses = await prisma.expense.findMany({
            where: {
                date: new Date(date),
            },
        });

        return expenses;
    }

    async getExpensesByAmount(amount: number): Promise<Expense[]> {
        const expenses = await prisma.expense.findMany({
            where: {
                amount,
            },
        });

        return expenses;
    }
}
