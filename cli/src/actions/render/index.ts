import { Command } from 'commander';
import { validateProjectInitialized, getDefaultProjectConfig, validateFileNames } from '../shared/helpers/validationHelper';
import { dockerComposePull, dockerComposeUp, getBaseComposePath, getOverridePath } from './dockerComposeHelper';
import { readFile, readFilesForConversation } from '../shared/helpers/fileHelper';
import path from 'path';
import { Infra0ProjectConfig, Infra0ProjectJSON } from '../shared/types';
import { getFilesInDirectory } from '../shared/helpers/directoryHelper';
import { displayPromptForConversationSelection } from './conversationHelper';
import { NEW_CONVERSATION_ID, NEW_CONVERSATION_LABEL } from './constants';


export const addRenderAction = (program: Command) => {
    program.action(async () => {
        try {
            // Validate that project has been initialized
            const config = getDefaultProjectConfig();
            validateProjectInitialized(config);
            
            console.log("Starting Infra0 Visualizer...");
            
            const workingDirectory = process.cwd();
            const baseComposePath = getBaseComposePath();
            const overridePath = getOverridePath(workingDirectory);
            
            const dockerComposeOptions = {
                baseComposePath,
                overridePath,
                workingDirectory
            };

            // Pull latest images
            await dockerComposePull(dockerComposeOptions);
            
            // Start services in detached mode
            await dockerComposeUp(dockerComposeOptions, true);
            
            console.log("Infra0 Visualizer is running!");
            console.log("UI: http://localhost:3000");
            console.log("Server: http://localhost:4000");

            // Extract coversationIds from `.infra0/project.json`
            const projectJSON: Infra0ProjectJSON = JSON.parse(readFile(path.join(config.metadataDirectoryName, config.projectJSONFileName)));
            const conversationSelections = [
                {
                    id: NEW_CONVERSATION_ID,
                    label: NEW_CONVERSATION_LABEL
                },
                ...projectJSON.conversationIds.map((id) => ({
                    id,
                    label: id
                }))
            ]
            const selectedConversation = await displayPromptForConversationSelection(conversationSelections);
            // List files
            const projectDirectory = path.join(process.cwd(), projectJSON.path);
            const files = getFilesInDirectory(projectDirectory);
            
            const filteredFiles = validateFileNames(files);

            const conversationContent = readFilesForConversation(filteredFiles);
            
        } catch (error) {
            if (error instanceof Error) {
                console.error(`❌ ${error.message}`);
            } else {
                console.error('❌ An unexpected error occurred:', error);
            }
            process.exit(1);
        }
    });
}