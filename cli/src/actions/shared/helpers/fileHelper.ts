import fs from 'fs';
import path from 'path';


/**
 * Creates or overwrites a file at the given path with the provided content.
 * @param filePath - The full path where the file should be created
 * @param content - The content to write to the file
 */
export function writeFile(filePath: string, content: string): void {
    try {
        fs.writeFileSync(filePath, content);
        console.log(`Created or overwrote ${path.basename(filePath)} in ${path.dirname(filePath)}`);
    } catch (error) {
        throw new Error(`Failed to write ${path.basename(filePath)}: ${error}`);
    }
}

/**
 * Read a file and return the content.
 * @param filePath - The path to the file to read
 * @returns string - The formatted content of the file
 */
export function readFile(filePath: string): string {
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
}

/**
 * Read multiple files and return the content of each, separated with line breaks.
 * Each file's content starts with its path for context.
 * @param filePaths - The paths to the files to read
 * @returns string - The combined formatted content of all files
 */
export function readFilesForConversation(filePaths: string[]): string {
    return filePaths.map((filePath) => `File: ${filePath}\n\n${readFile(filePath)}`).join('\n\n---\n\n');
}