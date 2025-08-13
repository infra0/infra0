import { prompt } from 'enquirer';
import { ConversationSelection } from './types';
import { getFilesInDirectory } from '../shared/helpers/directoryHelper';
import { validateFileNames } from '../shared/helpers/validationHelper';
import { readFilesForConversationAndGeneratePrompt } from '../shared/helpers/fileHelper';
import path from 'path';
import { Infra0ProjectJSON, Infra0ProjectTokensData } from '../../types';
import { NEW_CONVERSATION_ID, NEW_CONVERSATION_LABEL } from './constants';
import { SessionAuth } from '../../services/visualizer/auth';
import { DemoUserAuth } from '../../services/visualizer/auth';
import { Conversation } from '../../services/visualizer/conversation';

export const displayPromptForRunningVisualizerLocally = async () => {
    const response = await prompt({
        type: 'confirm',
        name: 'runningVisualizerLocally',
        message: 'Would you like to run the visualizer locally?',
    }) as { runningVisualizerLocally: boolean };

    return response.runningVisualizerLocally
}

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


export const showConversationSelectionPrompt = async (conversations: string[]) => {
    const conversationSelections = [
      {
        id: NEW_CONVERSATION_ID,
        label: NEW_CONVERSATION_LABEL,
      },
      ...conversations.map((conversation) => ({
        id: conversation,
        label: conversation,
      })),
    ];
  
    const selectedConversation = await displayPromptForConversationSelection(
      conversationSelections
    );
  
    return selectedConversation;
  }

export const getPromptForNewConversation = async (projectJSON: Infra0ProjectJSON) => {

    const projectDirectory = path.join(process.cwd(), projectJSON.path);
    const files = getFilesInDirectory(projectDirectory);
  
    const filteredFiles = validateFileNames(files);
  
    const prompt = readFilesForConversationAndGeneratePrompt(filteredFiles);
    return prompt;
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

export const getOrRefreshTokensFromConfig = async (
    projectJSON: Infra0ProjectJSON,
    authService: SessionAuth | DemoUserAuth
  ): Promise<Infra0ProjectTokensData> => {
    const existingTokens = projectJSON.visualizerData?.tokens;
    if (
      existingTokens &&
      existingTokens.access?.token &&
      existingTokens.refresh?.token
    ) {
      try {
        const isValidToken = await authService.isTokenValid(
          existingTokens.access.token
        );
        if (isValidToken) {
          // Access token is valid, use it
          return existingTokens;
        } else {
          // Access token invalid, try to refresh
          const refreshedTokens = await authService.refreshTokens(
            existingTokens.refresh.token
          );
          if (
            refreshedTokens &&
            refreshedTokens.access?.token &&
            refreshedTokens.refresh?.token
          ) {
            return refreshedTokens;
          } else {
            throw new Error("Refresh token is invalid or refresh failed.");
          }
        }
      } catch (error) {
        console.error("❌ Failed to validate or refresh tokens:", error);
        throw new Error("Could not validate or refresh tokens.");
      }
    } else {
      throw new Error("No valid tokens found in project.json.");
    }
  };


export const startConversationSelectionFlow = async (
    projectJSON: Infra0ProjectJSON,
    conversationService: Conversation,
    tokens: Infra0ProjectTokensData,
    conversations: string[]
  ) => {
    const selectedConversation = await showConversationSelectionPrompt(conversations);
  
    let conversationToRender: string;
  
    if(selectedConversation.id === NEW_CONVERSATION_ID) {
      const prompt = await getPromptForNewConversation(projectJSON);
      conversationToRender = (await conversationService.createConversation({ prompt }, tokens.access.token)).data._id;
    } else {
      conversationToRender = selectedConversation.id;
    }
  
    return conversationToRender;
  }