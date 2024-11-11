import prisma from "@/lib/prisma"

export default async function Dashboard() {
    const expenses = await prisma.expense.findMany();
    const reminders = await prisma.reminder.findMany();

    return (
        <div className="p-4">
            <div className="m-4">
                <h1>Dashboard</h1>
                <button className="btn btn-neutral">Adicionar</button>
                <div className="overflow-x-auto rounded-box">
                    <table className="table table-xs table-pin-rows table-pin-cols p-4 rounded-lg">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Descrição</th>
                                <th>Categoria</th>
                                <th>Valor</th>
                                <th>Data</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map(expense => (
                                <tr key={expense.id}>
                                    <th>{expense.id}</th>
                                    <td>{expense.description}</td>
                                    <td>{expense.category}</td>
                                    <td>{expense.amount}</td>
                                    <td>{expense.date.toLocaleDateString()}</td>
                                    <th>{expense.id}</th>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th></th>
                                <th>Descrição</th>
                                <th>Categoria</th>
                                <th>Valor</th>
                                <th>Data</th>
                                <th></th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <div className="m-4">
                <h1>Lembretes</h1>
                <button className="btn btn-neutral">Adicionar</button>

                <div className="overflow-x-auto rounded-box">
                    <table className="table table-xs table-pin-rows table-pin-cols p-4">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Titulo</th>
                                <th>Descrição</th>
                                <th>Data</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {reminders.map(reminder => (
                                <tr key={reminder.id}>
                                    <th>{reminder.id}</th>
                                    <td>{reminder.title}</td>
                                    <td>{reminder.description || 'Sem descrição'}</td>
                                    <td>{reminder.date.toLocaleDateString()}</td>
                                    <th>{reminder.id}</th>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th></th>
                                <th>Titulo</th>
                                <th>Descrição</th>
                                <th>Data</th>
                                <th></th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div >
    )
}