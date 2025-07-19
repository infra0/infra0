import { spawn } from 'child_process';

/**
 * @param hostPort e.g. 3000
 * @param containerPort e.g. 3000
 */
interface PortMapping {
    hostPort: number;
    containerPort: number;
  }
  

/**
 * Returns true if at least one local image matches imageRef (repo[:tag]).
 * @param imageRef e.g. "visualizer:stage"
 */
export function checkIfImageExists(imageRef: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const child = spawn('docker', ['images', '-q', imageRef], {
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', d => { stdout += d; });
    child.stderr.on('data', d => { stderr += d; });

    child.on('error', reject);

    child.on('close', code => {
      if (code !== 0) {
        return reject(new Error(`docker images exited with code ${code}. stderr: ${stderr}`));
      }
      resolve(stdout.trim().length > 0);
    });
  });
}

/**
 * Always runs `docker pull <imageRef>` and resolves when done.
 * @param imageRef e.g. "visualizer:stage"
 */
export function fetchImage(imageRef: string, platform: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const args = ['pull', '--platform', platform, imageRef];
      const child = spawn('docker', args, { stdio: ['ignore', 'pipe', 'pipe'] });
  
      let err = '';
      child.stderr.on('data', d => { err += d; });
      child.on('error', reject);
      child.on('close', code => {
        code === 0 ? resolve() : reject(new Error(`docker pull failed (code ${code}): ${err}`));
      });
    });
  }

/**
 * Returns true if the image is running.
 * @param imageRef e.g. "visualizer:stage"
 */
export function isImageRunning(imageRef: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const child = spawn('docker', ['ps', '--format', '{{.Image}}'], { stdio: ['ignore','pipe','pipe'] });
  
      let out = '';
      let err = '';
  
      child.stdout.on('data', d => { out += d.toString(); });
      child.stderr.on('data', d => { err += d.toString(); });
      child.on('error', reject);
      child.on('close', code => {
        if (code !== 0) return reject(new Error(`docker ps failed (code ${code}): ${err.trim()}`));
        const runningImages = out.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
        resolve(runningImages.includes(imageRef));
      });
    });
  }


/**
 * Runs an existing local Docker image. Throws if the image is not present locally.
 * @param imageRef e.g. "visualizer:stage"
 * @param port single port mapping { hostPort, containerPort }
 * @returns containerId string
 */
export async function runExistingImage(
    imageRef: string,
    portMapping: PortMapping,
  ): Promise<string> {
  
    const args = ['run', '-d', '-p', `${portMapping.hostPort}:${portMapping.containerPort}`, imageRef];
  
    const child = spawn('docker', args, { stdio: ['ignore', 'pipe', 'pipe'] });
  
    let stdout = '';
    let stderr = '';
  
    return await new Promise<string>((resolve, reject) => {
      child.stdout.on('data', d => { stdout += d.toString(); });
      child.stderr.on('data', d => { stderr += d.toString(); });
      child.on('error', reject);
      child.on('close', code => {
        if (code !== 0) {
          return reject(new Error(`docker run failed (code ${code}): ${stderr.trim()}`));
        }
        const id = stdout.trim();
        if (!id) {
          return reject(new Error(`Could not obtain container ID from output: "${stdout}"`));
        }
        resolve(id);
      });
    });
  }

