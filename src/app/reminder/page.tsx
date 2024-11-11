import prisma from "@/lib/prisma";
import { redirect } from 'next/navigation'

export default function CreateReminder() {

    const formData = new FormData();

    async function create() {
        'use server';
        try {

            const rawFormData = {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                date: new Date(formData.get('date') as string),
            }

            const reminder = await prisma.reminder.create({
                data: rawFormData
            });

        } catch (error) {
            console.error(error);
        }

        redirect('/')
    }


    return (
        <div className="overflow-x-auto p-5">
            <h1>Criar Lembrete</h1>
            <form method="post" onSubmit={create}>
                <div className="form-group">
                    <label htmlFor="title">Titulo</label>
                    <input type="text" name="title" id="title" className="form-control" />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Descrição</label>
                    <textarea name="description" id="description" className="form-control"></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="date">Data</label>
                    <input type="date" name="date" id="date" className="form-control" />
                </div>
                <button type="submit" className="btn btn-primary">Salvar</button>
            </form>
        </div>
    )
}