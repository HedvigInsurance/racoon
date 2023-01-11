export const COMMON_CONFIG = {
  site: 'datadoghq.eu',
  env: process.env.NEXT_PUBLIC_DATADOG_ENV || 'dev',
}

export const SERVER_CONFIG = {
  ...COMMON_CONFIG,
  service: process.env.DD_SERVICE,
  apiKey: process.env.DATADOG_API_KEY,
  host: process.env.VERCEL_URL || 'localhost',
}

export const CLIENT_CONFIG = {
  ...COMMON_CONFIG,
  service: process.env.NEXT_PUBLIC_DATADOG_SERVICE_NAME,
  host: process.env.NEXT_PUBLIC_VERCEL_URL || 'localhost',
  sampleRate: 100,
  version: process.env.NEXT_PUBLIC_DATADOG_VERSION || process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
}
