#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

# Don't build this branch
echo "🛑 - Build cancelled"
exit 0;
