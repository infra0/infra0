import { spawn } from 'child_process';
import path from 'path';
import { BASE_COMPOSE_FILE_PATH, INFRA0_DIRECTORY_NAME, OVERRIDE_FILE_NAME } from '../constants';

interface DockerComposeOptions {
    baseComposePath: string;
    overridePath: string;
    workingDirectory: string;
}

/**
 * Runs docker compose pull command
 * @param options - Docker compose configuration options
 * @returns Promise<void>
 */
export function dockerComposePull(options: DockerComposeOptions): Promise<void> {
    return new Promise((resolve, reject) => {
        const { baseComposePath, overridePath, workingDirectory } = options;
        
        console.log('Pulling latest images...');
        
        const dockerCompose = spawn('docker', [
            'compose',
            '-f', baseComposePath,
            '-f', overridePath,
            'pull'
        ], {
            cwd: workingDirectory,
            stdio: 'inherit'
        });

        dockerCompose.on('close', (code) => {
            if (code === 0) {
                console.log('Images pulled successfully');
                resolve();
            } else {
                reject(new Error(`Docker compose pull failed with code ${code}`));
            }
        });

        dockerCompose.on('error', (error) => {
            reject(new Error(`Failed to execute docker compose pull: ${error.message}`));
        });
    });
}

/**
 * Runs docker compose up command
 * @param options - Docker compose configuration options
 * @param detached - Whether to run in detached mode
 * @returns Promise<void>
 */
export function dockerComposeUp(options: DockerComposeOptions, detached: boolean = true): Promise<void> {
    return new Promise((resolve, reject) => {
        const { baseComposePath, overridePath, workingDirectory } = options;
        
        console.log('Starting services...');
        
        const args = [
            'compose',
            '-f', baseComposePath,
            '-f', overridePath,
            'up'
        ];

        if (detached) {
            args.push('-d');
        }

        const dockerCompose = spawn('docker', args, {
            cwd: workingDirectory,
            stdio: 'inherit'
        });

        dockerCompose.on('close', (code) => {
            if (code === 0) {
                console.log('Services started successfully');
                resolve();
            } else {
                reject(new Error(`Docker compose up failed with code ${code}`));
            }
        });

        dockerCompose.on('error', (error) => {
            reject(new Error(`Failed to execute docker compose up: ${error.message}`));
        });
    });
}

/**
 * Gets the path to the base docker-compose.yml file in resources
 * @returns string - Absolute path to the base compose file
 */
export function getBaseComposePath(): string {
    return path.resolve(__dirname, BASE_COMPOSE_FILE_PATH);
}

/**
 * Gets the path to the override file in .infra0 directory
 * @param workingDirectory - The working directory (usually process.cwd())
 * @returns string - Absolute path to the override file
 */
export function getOverridePath(workingDirectory: string): string {
    return path.resolve(workingDirectory, INFRA0_DIRECTORY_NAME, OVERRIDE_FILE_NAME);
} 