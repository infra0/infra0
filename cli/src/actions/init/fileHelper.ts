import fs from 'fs';
import path from 'path';
import { Infra0ProjectConfig } from './types';
import { INFRA0_OVERRIDE_FILE_CONTENT } from './constants';


/**
 * Creates the visualizer-compose.override.yml file
 * @param filePath - The full path where the file should be created
 */
function createOverrideFile(filePath: string): void {
    const content = INFRA0_OVERRIDE_FILE_CONTENT;
    
    try {
        fs.writeFileSync(filePath, content);
        console.log(`Created ${path.basename(filePath)} in ${path.dirname(filePath)}`);
    } catch (error) {
        throw new Error(`Failed to create ${path.basename(filePath)}: ${error}`);
    }
}

/**
 * Checks if the override file exists and creates it if it doesn't
 * @param config - The Infra0Config object containing directory and file names
 * @param directoryExisted - Whether the directory already existed before this operation
 */
export function checkAndCreateOverrideFile(config: Infra0ProjectConfig, directoryExisted: boolean): void {
    const overrideFilePath = path.join(config.directoryName, config.overrideFileName);

    if (fs.existsSync(overrideFilePath)) {
        console.log(`${config.overrideFileName} already exists in ${config.directoryName}`);
        return;
    }

    // If directory existed but file doesn't, warn user
    if (directoryExisted) {
        console.log(`${config.directoryName} exists but ${config.overrideFileName} is missing`);
    }

    createOverrideFile(overrideFilePath);
} 