import { Message, AgentResponse, AgentInput } from "@/interfaces";
import { AgentToolsService } from "@/services/AgentToolsService";
import OpenAI from 'openai';

export class AgentService {

    private openai: OpenAI;
    private agentToolsService: AgentToolsService;

    constructor() {
        this.openai = new OpenAI();
        this.agentToolsService = new AgentToolsService();
    }

    public async run(data: AgentInput): Promise<AgentResponse> {

        try {
            const toolsDescription = this.agentToolsService.getToolsDescription();

            let messages: Message[] = [
                { role: 'system', content: this.getSystemPrompt(toolsDescription, 1) },
                { role: 'user', content: `Question: ${data.userInput}\nQuestionDate: ${new Date().toLocaleString()}` },
            ];

            let assistantResponse = '';
            let actionLoop = true;
            let iteration = 1;

            while (actionLoop && iteration <= 10) {
                const completion = await this.openai.chat.completions.create({
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
                    const { actionName, actionInput } = this.agentToolsService.parseAction(assistantResponse);
                    const observation = await this.agentToolsService.executeAction(actionName, actionInput);
                    messages.push({ role: 'user', content: `Observation: ${observation}` });
                } else {
                    // Continue the loop if the assistant is reasoning
                    continue;
                }

                iteration++;
                if (iteration <= 10) {
                    messages[0].content = this.getSystemPrompt(toolsDescription, iteration);
                }
            }

            const userVisibleResponse = this.extractFinalAnswer(assistantResponse);

            return { finalAnswer: userVisibleResponse, messages };
        } catch (error) {
            console.error('Error running agent:', error);
            return { finalAnswer: 'An error occurred while running the agent', messages: [] };
        }

    }

    private extractFinalAnswer = (assistantResponse: string): string => {
        const answerRegex = /Answer:\s*(.*)/;
        const answerMatch = assistantResponse.match(answerRegex);
        return answerMatch ? answerMatch[1].trim() : 'I could not find an answer';
    };

    private getSystemPrompt = (toolsDescription: string, iteration: number): string => `
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


}