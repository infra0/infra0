import { Command } from 'commander';
import path from 'path';

import {
  validateProjectInitialized,
  getDefaultProjectConfig,
} from '../shared/helpers/validationHelper';
import {
  getBaseComposePath,
  getOverridePath,
  dockerComposePull,
  dockerComposeUp,
} from './dockerComposeHelper';
import {
  readFile,
  writeFile,
} from '../shared/helpers/fileHelper';
import { Infra0ProjectJSON } from '../shared/types';
import {
  displayPromptForConversationSelection,
  intiateNewConversation,
  validateVisualizerData,
} from './conversationHelper';
import { NEW_CONVERSATION_ID, NEW_CONVERSATION_LABEL } from './constants';
import {
  seedUser,
  getUserWithToken,
  getConversations,
  getVisualizerConversationUrl,
} from '../../services/visualizer';

export const addRenderAction = (program: Command) => {
  program.action(async () => {
    try {
      // Step 1: Validate project initialization
      const config = getDefaultProjectConfig();
      validateProjectInitialized(config);

      console.log('Starting Infra0 Visualizer...');

      const workingDirectory = process.cwd();
      const baseComposePath = getBaseComposePath();
      const overridePath = getOverridePath(workingDirectory);

      const dockerComposeOptions = {
        baseComposePath,
        overridePath,
        workingDirectory,
      };

      // --- Docker Compose (commented out for now) ---
      // await dockerComposePull(dockerComposeOptions);
      // await dockerComposeUp(dockerComposeOptions, true);
      console.log("Infra0 Visualizer is running!");
      console.log("UI: http://localhost:3000");
      console.log("Server: http://localhost:4000");

      // Step 2: Seed demo user and store token
      try {
        await seedUser();
        const userData = await getUserWithToken();

        console.log(userData);

        const projectJsonPath = path.join(
          config.metadataDirectoryName,
          config.projectJSONFileName
        );
        const projectJSON: Infra0ProjectJSON = JSON.parse(readFile(projectJsonPath));
        projectJSON.visualizerData = {
          userId: userData.data.user._id,
          tokens: userData.data.tokens,
        };
        writeFile(projectJsonPath, JSON.stringify(projectJSON, null, 2));
      } catch (error) {
        console.error('❌ Failed to initialize visualizer data:', error);
        process.exit(1);
      }

    //   Step 3: Load conversations and token
      let conversations: string[] = [];
      let token = '';
      const projectJsonPath = path.join(
        config.metadataDirectoryName,
        config.projectJSONFileName
      );
      const projectJSON: Infra0ProjectJSON = JSON.parse(readFile(projectJsonPath));

      console.log(projectJSON);

      validateVisualizerData(projectJSON);

      try {
        token = projectJSON.visualizerData.tokens.access.token;
        conversations = await getConversations(token);
      } catch (error) {
        console.error('❌ Failed to get conversations:', error);
        process.exit(1);
      }

      // Step 4: Prompt for conversation selection
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

      console.log(selectedConversation);

      // Step 5: Handle new or existing conversation
      const conversationToRender =
        selectedConversation.id === NEW_CONVERSATION_ID
          ? await intiateNewConversation(token, projectJSON)
          : selectedConversation.id;

      // Redirect user to the visualizer UI
      const visualizerUrl = getVisualizerConversationUrl(conversationToRender);
      console.log(`Visualizer running at: ${visualizerUrl}`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`❌ ${error.message}`);
      } else {
        console.error('❌ An unexpected error occurred:', error);
      }
      process.exit(1);
    }
  });
};
