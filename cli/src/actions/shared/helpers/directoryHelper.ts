import fs from 'fs';
import path from 'path';
import { Infra0ProjectConfig, Infra0ProjectJSON, Infra0ProjectTokensData } from '../../../types';
import { readFile, writeFile } from './fileHelper';

/**
 * Create a directory
 * @param directoryName - The name of the directory to create
 * @returns boolean - true if directory already existed, false if it was created
 */
export function createDirectory(directoryName: string): boolean {
    try {
        fs.mkdirSync(directoryName, { recursive: true });
        console.log(`Created ${directoryName} directory`);
        return true;
    } catch (error) {
        throw new Error(`Failed to create ${directoryName} directory: ${error}`);
    }
} 


/**
 * Recursively extract all file names from a directory and its subdirectories
 * @param directory - The directory to extract files from
 * @returns string[] - An array of file paths (relative to the input directory)
 */
export function getFilesInDirectory(directory: string): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(directory, { withFileTypes: true });
    for (const dirent of list) {
        const fullPath = `${directory}/${dirent.name}`;
        if (dirent.isDirectory()) {
            results = results.concat(getFilesInDirectory(fullPath));
        } else if (dirent.isFile()) {
            results.push(fullPath);
        }
    }
    return results;
}

/**
 * Forcefully delete a directory
 * @param directory - The directory to delete
 */
export function forceDeleteDirectory(directory: string): void {
    if (fs.existsSync(directory)) {
        fs.rmdirSync(directory, { recursive: true });
    }
}

/**
 * Check if a directory exists
 * @param directory - The directory to check
 * @returns boolean - true if directory exists, false otherwise
 */
export function directoryExists(directory: string): boolean {
    return fs.existsSync(directory);
}

export const updateTokensInProjectJSON = async (defaultProjectConfig: Infra0ProjectConfig, tokens: Infra0ProjectTokensData) => {
    const projectJsonPath = path.join(
      defaultProjectConfig.metadataDirectoryName,
      defaultProjectConfig.projectJSONFileName
    );
    const projectJSON: Infra0ProjectJSON = JSON.parse(readFile(projectJsonPath));
    projectJSON.visualizerData = {
      tokens,
    };
    console.log(projectJSON);
    writeFile(projectJsonPath, JSON.stringify(projectJSON, null, 2));
  }