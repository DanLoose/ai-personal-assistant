import { NextRequest, NextResponse } from 'next/server';
import { AgentService } from '@/services/AgentService';
import { AgentInput, AgentResponse } from '@/interfaces';

export async function POST(request: NextRequest): Promise<NextResponse> {
    const agentService = new AgentService();

    try {

        const { userInput, messages }: AgentInput = await request.json();
        const agentAnswer = await agentService.run({ userInput, messages });
        return NextResponse.json(agentAnswer);

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            finalAnswer: 'Alguma coisa deu errado. Por favor, tente novamente.',
            messages: [],
        });
    }
}
