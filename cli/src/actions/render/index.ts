import { Command } from 'commander';
import { checkIfImageExists, fetchImage, isImageRunning, runExistingImage } from './containerHelper';

export const addRenderAction = (program: Command) => {
    program.action(async () => {
        console.log("Running visualizer")
        const infra0UIImageUrl = process.env.INFRA0_UI_IMAGE_URL;
        const infra0UIImagePlatform = process.env.INFRA0_UI_IMAGE_PLATFORM || "linux/amd64"
        const infra0UiHostPort = Number(process.env.INFRA0_UI_HOST_PORT) || 3000
        const infra0UiContainerPort = Number(process.env.INFRA0_UI_CONTAINER_PORT) || 3000

        if (!infra0UIImageUrl) {
            console.error('INFRA0_UI_IMAGE_URL environment variable is required');
            return;
        }
        // Check if the image is present in users system
        try {
            console.log("Checking if image exists")
            let imageLocal = await checkIfImageExists(infra0UIImageUrl);
            if(!imageLocal) {
                console.log("Image does not exist, fetching image")
                await fetchImage(infra0UIImageUrl, infra0UIImagePlatform);
                imageLocal = await checkIfImageExists(infra0UIImageUrl);
            }
            console.log("Checking if image is running")
            const isRunning = await isImageRunning(infra0UIImageUrl);
            console.log("Is running", isRunning)
            if(!isRunning) {
                console.log("Image is not running, running image")
                await runExistingImage(infra0UIImageUrl, { hostPort: infra0UiHostPort, containerPort: infra0UiContainerPort });
            }
            console.log("Visualizer is running")
        } catch (error) {
            console.log(error)
        }
    });
}