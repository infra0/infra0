import fs from 'fs';

/**
 * Checks if the .infra0 directory exists and creates it if it doesn't
 * @param directoryName - The name of the directory to check/create
 * @returns boolean - true if directory already existed, false if it was created
 */
export function checkAndCreateInfra0Directory(directoryName: string): boolean {
    if (fs.existsSync(directoryName)) {
        console.log(`${directoryName} directory already exists`);
        return true;
    }

    try {
        fs.mkdirSync(directoryName, { recursive: true });
        console.log(`Created ${directoryName} directory`);
        return false;
    } catch (error) {
        throw new Error(`Failed to create ${directoryName} directory: ${error}`);
    }
} 