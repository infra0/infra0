import fs from 'fs';
import path from 'path';
import { Infra0ProjectConfig } from '../../../types';
import { INFRA0_DIRECTORY_NAME, OVERRIDE_FILE_NAME, PROJECT_JSON_FILE_NAME } from '../../constants';

/**
 * Validates that the project has been initialized by checking for required files
 * @param config - The Infra0ProjectConfig object
 * @returns boolean - true if project is initialized, false otherwise
 */
export function isProjectInitialized(config: Infra0ProjectConfig): boolean {
    const infra0DirPath = path.resolve(config.metadataDirectoryName);
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
            `Project is not initialized. Please run 'infra0 init' first to create the ${config.metadataDirectoryName} directory and ${config.overrideFileName} file.`
        );
    }
}

/**
 * Gets the default project configuration
 * @returns Infra0ProjectConfig - The default configuration
 */
export function getDefaultProjectConfig(): Infra0ProjectConfig {
    return {
        metadataDirectoryName: INFRA0_DIRECTORY_NAME,
        overrideFileName: OVERRIDE_FILE_NAME,
        projectJSONFileName: PROJECT_JSON_FILE_NAME
    };
}

/**
 * Takes directory as input and returns if it exists
 * @param directory - The directory to check
 * @returns boolean - true if directory exists, false otherwise
 */
export function directoryExists(directory: string): boolean {
    return fs.existsSync(directory);
}


/**
 * Validate file names and remove env files
 * @param files - The files to validate
 * @returns string[] - An array of valid file names
 */
export function validateFileNames(files: string[]): string[] {
    return files.filter((file) => !file.startsWith('.'));
}

/**
 * Checks projectPath and if its not at same level or inside current directory throw error
 * @param projectPath - The project path to check
 * @throws Error if projectPath is not at same level or inside current directory
 */
export function validateProjectPath(projectPath: string): void {
    if (projectPath.startsWith('..')) {
        throw new Error('Project path must be at the same level or inside the current directory');
    }
}