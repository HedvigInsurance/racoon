#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if [ "$VERCEL_GIT_COMMIT_REF" = "assets" ]; then
  echo "Ignoring branch $VERCEL_GIT_COMMIT_REF"
  exit 0
fi

# Support Vercel deploy hook
if [ "$VERCEL_GIT_COMMIT_SHA" = "$VERCEL_GIT_PREVIOUS_SHA" ]; then
  echo "Re-deploy of commit $VERCEL_GIT_COMMIT_SHA"
  exit 1
fi

yarn dlx turbo-ignore
