export const INFRA0_DIRECTORY_NAME = '.infra0';
export const OVERRIDE_FILE_NAME = 'visualizer-compose.override.yml';
export const BASE_COMPOSE_FILE_NAME = 'visualizer-compose.yml';
export const BASE_COMPOSE_FILE_PATH = `../../../resources/${BASE_COMPOSE_FILE_NAME}`;

export const INFRA0_OVERRIDE_FILE_CONTENT = `# Visualizer Docker Compose Override Configuration
# This file contains environment-specific overrides for the visualizer services

version: "3.9"

x-shared-env: &shared-env
  environment:
    NODE_ENV: \${NODE_ENV:-development}

services:
  infra0-visualizer-ui:
    <<: *shared-env
    ports:
      - 3000:3000
    container_name: infra0-visualizer-ui
    image: xshubhamx/infra0-visualizer-ui:\${NODE_ENV:-development}
    stop_signal: SIGINT

  infra0-visualizer-server:
    <<: *shared-env
    ports:
      - 4000:4000
    container_name: infra0-visualizer-server
    image: xshubhamx/infra0-visualizer-server:\${NODE_ENV:-development}
    stop_signal: SIGINT
`;