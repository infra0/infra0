import { Command } from 'commander';
import { validateProjectInitialized, getDefaultProjectConfig } from '../init/validationHelper';
import { dockerComposePull, dockerComposeUp, getBaseComposePath, getOverridePath } from './dockerComposeHelper';

export const addRenderAction = (program: Command) => {
    program.action(async () => {
        try {
            // Validate that project has been initialized
            const config = getDefaultProjectConfig();
            validateProjectInitialized(config);
            
            console.log("Starting Infra0 Visualizer...");
            
            const workingDirectory = process.cwd();
            const baseComposePath = getBaseComposePath();
            const overridePath = getOverridePath(workingDirectory);
            
            const dockerComposeOptions = {
                baseComposePath,
                overridePath,
                workingDirectory
            };

            // Pull latest images
            await dockerComposePull(dockerComposeOptions);
            
            // Start services in detached mode
            await dockerComposeUp(dockerComposeOptions, true);
            
            console.log("Infra0 Visualizer is running!");
            console.log("UI: http://localhost:3000");
            console.log("Server: http://localhost:4000");
            
        } catch (error) {
            if (error instanceof Error) {
                console.error(`❌ ${error.message}`);
            } else {
                console.error('❌ An unexpected error occurred:', error);
            }
            process.exit(1);
        }
    });
}