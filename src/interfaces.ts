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

export interface Expense {
    id: number;
    amount: number;
    description: string | null;
    date: Date;
    category: string;
}

export interface Tool {
    name: string;
    description: string;
    input: string;
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
