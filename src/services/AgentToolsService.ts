import { Tool } from '@/interfaces'
import { createReminderTool } from '@/tools/reminders/createReminderTool';
import { getRemindersTool } from '@/tools/reminders/getRemindersTool';
import { updateReminderTool } from '@/tools/reminders/updateReminderTool';
import { deleteRemindersTool } from '@/tools/reminders/deleteRemindersTool';

export class AgentToolsService {
    private tools: Map<string, Tool>;

    constructor() {
        this.tools = new Map();
        this.registerTool(createReminderTool);
        this.registerTool(getRemindersTool);
        this.registerTool(deleteRemindersTool);
        this.registerTool(updateReminderTool);
    }

    registerTool(tool: Tool) {
        this.tools.set(tool.name, tool);
    }

    getToolsDescription() {
        let descriptions = '';
        for (const tool of this.tools.values()) {
            descriptions += `- ${tool.name}: ${tool.description}\n`;
        }
        return descriptions;
    }

    parseAction(assistantMessage: string): { actionName: string; actionInput: string } {
        const actionRegex = /Action:\s*(.*)/;
        const actionInputRegex = /Action Input:\s*(.*)/;

        const actionMatch = assistantMessage.match(actionRegex);
        const actionInputMatch = assistantMessage.match(actionInputRegex);

        const actionName = actionMatch ? actionMatch[1].trim() : '';
        const actionInput = actionInputMatch ? actionInputMatch[1].trim() : '';

        return { actionName, actionInput };
    }

    async executeAction(actionName: string, actionInput: string): Promise<string> {
        const tool = this.tools.get(actionName);
        if (!tool) {
            return 'Unknown action';
        }
        try {
            return await tool.execute(JSON.parse(actionInput)).then((result) => { return JSON.stringify(result) });
        } catch (error) {
            if (error instanceof Error) {
                return `Failed to execute ${actionName}. ${error.message}`;
            }
            return `Failed to execute ${actionName}. Please check the input format.`;
        }
    }
}
