#!/usr/bin/env sh
set -eou pipefail

echo "Attempting to download latest translations from S3..."

if [ -z "${TRANSLATIONS_URL:-}" ]; then
  echo "Environment variable TRANSLATIONS_URL is unset, using: https://translations.hedvig.com/web-onboarding"
  baseURL="https://translations.hedvig.com/web-onboarding"
else
  baseURL="$TRANSLATIONS_URL"
fi

locales=(default dk dk-en se se-en no no-en)

for locale in ${locales[@]}; do
  mkdir -p "public/locales/${locale}"

  url="${baseURL}/${locale}/common.json"
  echo "Downloading ${url}"
  curl -s "$url" > "public/locales/${locale}/common.json"
done
