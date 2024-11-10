export interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
};

export interface Reminder {
    id: number;
    title: string;
    description: string | null;
    date: Date;
}

export interface Tool {
    name: string;
    description: string;
    execute: (input: any) => Promise<any>;
}


export interface AgentResponse {
    finalAnswer: string;
    messages: Message[];
}


export interface AgentInput {
    userInput: string;
    messages: Message[];
}
