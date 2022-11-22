#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if [ "$VERCEL_GIT_COMMIT_REF" = "assets" ]; then
  echo "Ignoring branch $VERCEL_GIT_COMMIT_REF"
  exit 0
fi

yarn dlx turbo-ignore