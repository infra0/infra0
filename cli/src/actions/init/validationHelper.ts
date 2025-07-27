import fs from 'fs';
import path from 'path';
import { Infra0ProjectConfig } from './types';
import { INFRA0_DIRECTORY_NAME, OVERRIDE_FILE_NAME } from '../constants';

/**
 * Validates that the project has been initialized by checking for required files
 * @param config - The Infra0ProjectConfig object
 * @returns boolean - true if project is initialized, false otherwise
 */
export function isProjectInitialized(config: Infra0ProjectConfig): boolean {
    const infra0DirPath = path.resolve(config.directoryName);
    const overrideFilePath = path.join(infra0DirPath, config.overrideFileName);

    return fs.existsSync(infra0DirPath) && fs.existsSync(overrideFilePath);
}

/**
 * Validates project initialization and throws an error if not initialized
 * @param config - The Infra0ProjectConfig object
 * @throws Error if project is not initialized
 */
export function validateProjectInitialized(config: Infra0ProjectConfig): void {
    if (!isProjectInitialized(config)) {
        throw new Error(
            `Project is not initialized. Please run 'infra0 init' first to create the ${config.directoryName} directory and ${config.overrideFileName} file.`
        );
    }
}

/**
 * Gets the default project configuration
 * @returns Infra0ProjectConfig - The default configuration
 */
export function getDefaultProjectConfig(): Infra0ProjectConfig {
    return {
        directoryName: INFRA0_DIRECTORY_NAME,
        overrideFileName: OVERRIDE_FILE_NAME
    };
} 