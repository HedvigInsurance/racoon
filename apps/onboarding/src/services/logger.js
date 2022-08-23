import datadog from 'pino-datadog'
import pinoms from 'pino-multi-stream'

const writeStream = await datadog.createWriteStream({
  apiKey: process.env.DATADOG_API_KEY,
  hostname: process.env.VERCEL_URL || 'localhost',
  // URL will be racoon-onboarding.vercel.app when deployed on Vercel, but empty string when running locally.
  // NEXT_PUBLIC_DATADOG_SERVICE_NAME will be racoon-onboarding, so this is just a way to set a meaningful
  // service name when running locally.
  service: process.env.VERCEL_URL || `${process.env.NEXT_PUBLIC_DATADOG_SERVICE_NAME}.local`,
  ddsource: 'nodejs',
  eu: true,
})
const logger = pinoms({ streams: [{ stream: writeStream }] })

export default logger
