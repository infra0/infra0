import { prompt } from 'enquirer';
import { ConversationSelection } from './types';

export const displayPromptForConversationSelection = async (conversations: ConversationSelection[]): Promise<ConversationSelection> => {
    const response = await prompt({
        type: 'select',
        name: 'conversationSelection',
        message: 'Please select a conversation to visualize:',
        choices: conversations.map((conversation) => ({
            name: conversation.label,
            value: conversation.id
        }))
    }) as { conversationSelection: string };
    
    const selectedId = response.conversationSelection;
    const selectedConversation = conversations.find(conv => conv.id === selectedId);
    
    if (!selectedConversation) {
        throw new Error('Invalid conversation selection');
    }
    
    return selectedConversation;
}