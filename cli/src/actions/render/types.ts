export interface ConversationSelection {
    id: string;
    label: string;
}

export type DockerComposeOptions = {
    baseComposePath: string;
    overridePath: string;
    workingDirectory: string;
  }