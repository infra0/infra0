import { prompt } from 'enquirer';
import { ConversationSelection } from './types';
import { createConversation } from '../../services/visualizerApi';
import { getFilesInDirectory } from '../shared/helpers/directoryHelper';
import { validateFileNames } from '../shared/helpers/validationHelper';
import { readFilesForConversation } from '../shared/helpers/fileHelper';
import path from 'path';
import { Infra0ProjectJSON } from '../shared/types';

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
    
    const selectedConversationLabel = response.conversationSelection;
    // Compare by id instead of label, since the prompt returns the id as value
    let selectedConversation = undefined;

    for (const conversation of conversations) {
        if (conversation.label === selectedConversationLabel) {
            selectedConversation = conversation;
            break;
        }
    }
    
    if (!selectedConversation) {
        throw new Error('Invalid conversation selection');
    }
    
    return selectedConversation;
}


export const intiateNewConversation = async (token: string, projectJSON: Infra0ProjectJSON) => {

                // List files
    const projectDirectory = path.join(process.cwd(), projectJSON.path);
    const files = getFilesInDirectory(projectDirectory);
    
    const filteredFiles = validateFileNames(files);

    const prompt = readFilesForConversation(filteredFiles);
    const conversationId = await createConversation(token, prompt);
    return conversationId;
}

export const validateVisualizerData = (projectJSON: Infra0ProjectJSON) => {
    if (!projectJSON.visualizerData) {
        throw new Error('Visualizer data not found in project.json');
    }
    if (!projectJSON.visualizerData.tokens) {
        throw new Error('Tokens not found in project.json');
    }
    if (!projectJSON.visualizerData.tokens.access) {
        throw new Error('Access token not found in project.json');
    }
    if (!projectJSON.visualizerData.tokens.refresh) {
        throw new Error('Refresh token not found in project.json');
    }
}