import { Command } from 'commander';
import { createDirectory, forceDeleteDirectory } from '../shared/helpers/directoryHelper';
import { writeFile } from '../shared/helpers/fileHelper';
import { Infra0ProjectConfig } from '../../types';
import { INFRA0_DIRECTORY_NAME, OVERRIDE_FILE_NAME, PROJECT_JSON_FILE_NAME, INFRA0_OVERRIDE_FILE_CONTENT, INFRA0_PROJECT_JSON_FILE_CONTENT } from '../constants';
import path from 'path';
import { InitCommandOptions } from './types';
import { directoryExists, validateProjectPath } from '../shared/helpers/validationHelper';

export const addInitAction = (program: Command) => {
    program.action((options: InitCommandOptions) => {

        if(!options.projectPath){
            throw new Error('Project path is required');
        }

        if(options.force){
            console.log('Forcefully initializing a new project');
            forceDeleteDirectory(INFRA0_DIRECTORY_NAME);
        }

        if(directoryExists(INFRA0_DIRECTORY_NAME)){
            throw new Error('Project already initialized');
        }

        validateProjectPath(options.projectPath);

        const config: Infra0ProjectConfig = {
            metadataDirectoryName: INFRA0_DIRECTORY_NAME,
            overrideFileName: OVERRIDE_FILE_NAME,
            projectJSONFileName: PROJECT_JSON_FILE_NAME
        };

        try {
            createDirectory(config.metadataDirectoryName);
            writeFile(path.join(config.metadataDirectoryName, config.overrideFileName), INFRA0_OVERRIDE_FILE_CONTENT);

            const projectJSON = INFRA0_PROJECT_JSON_FILE_CONTENT;
            projectJSON.path = options.projectPath;

            writeFile(path.join(config.metadataDirectoryName, config.projectJSONFileName), JSON.stringify(projectJSON, null, 2));

            console.log('Initialization completed successfully');
        } catch (error) {
            console.error('Initialization failed:', error);
            process.exit(1);
        }
    });
}