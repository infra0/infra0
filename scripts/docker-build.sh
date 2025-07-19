#!/bin/bash

# Default values
PLATFORM="linux/amd64"
IMAGE_NAME="xshubhamx/infra0-visualizer-ui"
TAG="stage"

while [[ "$#" -gt 0 ]]; do
  case $1 in
    --platform=*) PLATFORM="${1#*=}" ;;
    --image=*) IMAGE_NAME="${1#*=}" ;;
    --tag=*) TAG="${1#*=}" ;;
    -p|--platform) PLATFORM="$2"; shift ;;
    -i|--image) IMAGE_NAME="$2"; shift ;;
    -t|--tag) TAG="$2"; shift ;;
    -h|--help)
      echo "Usage: $0 [--platform=PLATFORM] [--image=IMAGE_NAME] [--tag=TAG]"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Use --help for usage"
      exit 1
      ;;
  esac
  shift
done

echo "Building Docker image with:"
echo "Platform: $PLATFORM"
echo "Image Name: $IMAGE_NAME"
echo "Tag: $TAG"

docker buildx build \
  --platform "$PLATFORM" \
  -t "$IMAGE_NAME:$TAG" \
  ./visualizer/ui
