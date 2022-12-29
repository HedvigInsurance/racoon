#!/bin/sh
set -eou pipefail

mkdir -p audit
yarn info --all --name-only --json | grep "@npm:" > audit/frontend-deps.txt
yarn licenses list --production > audit/frontend-license-list.txt
yarn licenses generate-disclaimer --production > audit/frontend-license-texts.txt