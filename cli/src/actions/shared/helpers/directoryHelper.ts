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