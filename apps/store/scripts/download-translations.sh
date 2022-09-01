#!/usr/bin/env bash
set -eou pipefail

echo "Attempting to download latest translations from Lokalise..."

if [ -z "${LOKALISE_TOKEN:-}" ]; then
  printf "Environment variable LOKALISE_TOKEN is unset. Enter Lokalise API token: "
  read -r token || exit 1
else
  echo "Using environment variable LOKALISE_TOKEN for Lokalise API token"
  token="$LOKALISE_TOKEN"
fi

if [ -z "$token" ]; then
  echo "No Lokalise API token provided"
  exit 1
fi

if ! command -v lokalise2 &> /dev/null
then
    echo "lokalise2 CLI could not be found, please install:"
    echo "https://github.com/lokalise/lokalise-cli-2-go#installation"
    exit
fi

lokalise2 \
  -t "$token" \
  --project-id 743091915e9da969db9340.20943733 \
  file download \
  --format json \
  --export-sort first_added \
  --add-newline-eof \
  --replace-breaks=false \
  --original-filenames=false \
  --bundle-structure 'public/locales/%LANG_ISO%/common.json' \
  --placeholder-format icu \
  --include-tags web-onboarding \
  --indentation 2sp \
  --filter-langs 'en,da_DK,en_DK,sv_SE,en_SE,nb_NO,en_NO' \
  --language-mapping '[
    {"original_language_iso": "en","custom_language_iso": "default"},
    {"original_language_iso": "da_DK","custom_language_iso": "da-dk"},
    {"original_language_iso": "en_DK","custom_language_iso": "en-dk"},
    {"original_language_iso": "sv_SE","custom_language_iso": "sv-se"},
    {"original_language_iso": "en_SE","custom_language_iso": "en-se"},
    {"original_language_iso": "nb_NO","custom_language_iso": "nb-no"},
    {"original_language_iso": "en_NO","custom_language_iso": "en-no"}
  ]'
