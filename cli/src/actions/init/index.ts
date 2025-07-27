import { Command } from 'commander';
import { checkAndCreateInfra0Directory } from './directoryHelper';
import { checkAndCreateOverrideFile } from './fileHelper';
import { Infra0ProjectConfig } from './types';
import { INFRA0_DIRECTORY_NAME, OVERRIDE_FILE_NAME } from './constants';

export const addInitAction = (program: Command) => {
    program.action(() => {
        const config: Infra0ProjectConfig = {
            directoryName: INFRA0_DIRECTORY_NAME,
            overrideFileName: OVERRIDE_FILE_NAME
        };

        try {
            const directoryExists = checkAndCreateInfra0Directory(config.directoryName);
            
            checkAndCreateOverrideFile(config, directoryExists);
            
            console.log('Initialization completed successfully');
        } catch (error) {
            console.error('Initialization failed:', error);
            process.exit(1);
        }
    });
}