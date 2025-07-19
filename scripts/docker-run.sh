#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME="${1:-xshubhamx/infra0-visualizer-ui}"
TAG="${2:-stage}"
HOST_PORT="${3:-3000}"
CONTAINER_PORT="${4:-3000}"
EXTRA_ARGS="${EXTRA_ARGS:-}"

FULL_IMAGE="${IMAGE_NAME}:${TAG}"
CONTAINER_NAME="$(echo "${IMAGE_NAME}" | tr '/:.' '_')"

echo "==> Image:        ${FULL_IMAGE}"
echo "==> Container:    ${CONTAINER_NAME}"
echo "==> Port mapping: host ${HOST_PORT} -> container ${CONTAINER_PORT}"

# Verify image exists locally
if ! docker image inspect "${FULL_IMAGE}" >/dev/null 2>&1; then
  echo "ERROR: Image '${FULL_IMAGE}' not found locally."
  echo "       Build or pull it first. Example:"
  echo "       docker pull ${FULL_IMAGE}"
  exit 1
fi

if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "==> Removing existing container ${CONTAINER_NAME}"
  docker rm -f "${CONTAINER_NAME}" >/dev/null
fi

echo "==> Starting container..."
set -x
docker run -d \
  --name "${CONTAINER_NAME}" \
  -p "${HOST_PORT}:${CONTAINER_PORT}" \
  ${EXTRA_ARGS} \
  "${FULL_IMAGE}"
set +x

echo "==> Running. Visit: http://localhost:${HOST_PORT}"
echo "==> Logs:    docker logs -f ${CONTAINER_NAME}"
echo "==> Stop:    docker stop ${CONTAINER_NAME}"
echo "==> Remove:  docker rm -f ${CONTAINER_NAME}"
