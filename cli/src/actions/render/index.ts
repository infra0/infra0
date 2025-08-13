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
import { Infra0ProjectConfig, Infra0ProjectJSON, Infra0ProjectTokensData } from '../../types';
import {
  displayPromptForRunningVisualizerLocally,
  getOrRefreshTokensFromConfig,
  startConversationSelectionFlow,
} from './conversationHelper';
import { CLOUD_VISUALIZER_API_BASE_URL, CLOUD_VISUALIZER_URL, LOCAL_VISUALIZER_API_BASE_URL, LOCAL_VISUALIZER_URL } from './constants';
import { DockerComposeOptions } from './types';
import { SessionAuth, DemoUserAuth } from '../../services/visualizer/auth';
import { Conversation } from '../../services/visualizer/conversation';
import { updateTokensInProjectJSON } from '../shared/helpers/directoryHelper';

const getVisualizerConversationUrl = (visualizerUrl: string, conversationId: string) => {
  return `${visualizerUrl}/project/${conversationId}?need_streaming=true`;
}

const initiateLocalVisualizerFlow = async (
  defaultProjectConfig: Infra0ProjectConfig,
  projectJSON: Infra0ProjectJSON,
  dockerComposeOptions: DockerComposeOptions,
) => {

  const conversationService = new Conversation(LOCAL_VISUALIZER_API_BASE_URL);
  const demoUserAuthService = new DemoUserAuth(LOCAL_VISUALIZER_API_BASE_URL);

  await dockerComposePull(dockerComposeOptions);
  await dockerComposeUp(dockerComposeOptions, true);
  console.log("Infra0 Visualizer is running!");

  let tokens: Infra0ProjectTokensData;
  try {
    tokens = await getOrRefreshTokensFromConfig(projectJSON, demoUserAuthService as DemoUserAuth);
  } catch (error) {
    try {
      tokens = await demoUserAuthService.getTokens();
    } catch (fetchError) {
      console.error("❌ Failed to fetch new tokens:", fetchError);
      process.exit(1);
    }
  }

  await updateTokensInProjectJSON(defaultProjectConfig, tokens);

  const conversations = (await conversationService.getConversations(tokens.access.token)).data.conversations.map((conversation: any) => conversation._id);

  const conversationToRender = await startConversationSelectionFlow(projectJSON, conversationService, tokens, conversations);

  const visualizerUrl = getVisualizerConversationUrl(LOCAL_VISUALIZER_URL, conversationToRender);
  console.log(`Visualizer running at: ${visualizerUrl}`);
};

const initiateCloudVisualizerFlow = async (
  defaultProjectConfig: Infra0ProjectConfig,
  projectJSON: Infra0ProjectJSON,
) => {

  const conversationService = new Conversation(CLOUD_VISUALIZER_API_BASE_URL);
  const sessionAuthService = new SessionAuth(CLOUD_VISUALIZER_API_BASE_URL);

  let tokens: Infra0ProjectTokensData;
  try {
    tokens = await getOrRefreshTokensFromConfig(projectJSON, sessionAuthService);
  } catch (error) {
    try {
      tokens = await sessionAuthService.getTokens();
    } catch (fetchError) {
      console.error("❌ Failed to fetch new tokens:", fetchError);
      process.exit(1);
    }
  }

  await updateTokensInProjectJSON(defaultProjectConfig, tokens);

  const conversations = (await conversationService.getConversations(tokens.access.token)).data.conversations.map((conversation: any) => conversation._id);

  const conversationToRender = await startConversationSelectionFlow(projectJSON, conversationService, tokens, conversations);

  const visualizerUrl = getVisualizerConversationUrl(CLOUD_VISUALIZER_URL, conversationToRender);
  console.log(`Visualizer running at: ${visualizerUrl}`);
}

export const addRenderAction = (program: Command) => {
  program.action(async () => {
    try {
      // Step 1: Validate project initialization
      const config = getDefaultProjectConfig();
      validateProjectInitialized(config);

      const runningVisualizerLocally = await displayPromptForRunningVisualizerLocally();

      const workingDirectory = process.cwd();
      const baseComposePath = getBaseComposePath();
      const overridePath = getOverridePath(workingDirectory);

      const dockerComposeOptions = {
        baseComposePath,
        overridePath,
        workingDirectory,
      };

      const projectJSON = JSON.parse(readFile(path.join(config.metadataDirectoryName, config.projectJSONFileName)));

      if(runningVisualizerLocally) {
        await initiateLocalVisualizerFlow(config, projectJSON, dockerComposeOptions);
      } else {
        await initiateCloudVisualizerFlow(config, projectJSON);
      }
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