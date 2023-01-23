import { datadogLogs, LogsInitConfiguration } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import { Tracking } from '@/services/Tracking/Tracking'

const env = process.env.NEXT_PUBLIC_DATADOG_ENV || 'local'
let version = process.env.NEXT_PUBLIC_DATADOG_VERSION
if (!version) {
  if (env === 'local') version = 'local'
  else
    version = `${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF}_${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}`
}
const CLIENT_CONFIG = {
  env,
  sampleRate: 100,
  service: process.env.NEXT_PUBLIC_DATADOG_SERVICE_NAME,
  site: 'datadoghq.eu',
  version,
}

const applicationId = process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID
const clientToken = process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN

export const initDatadog = () => {
  if (!applicationId || !clientToken) return

  const datadogLogsConfig: LogsInitConfiguration = {
    ...CLIENT_CONFIG,
    clientToken,
    forwardErrorsToLogs: true,
  }

  if (env === 'local') {
    datadogLogsConfig.beforeSend = (event) => {
      // Must exclude console origin to avoid endless loop.  Feel free to experiment with other values
      if (event.origin === 'logger') {
        if (event.logger?.name === Tracking.LOGGER_NAME) {
          console[event.status]('tracking event', event.message, event)
        } else {
          console[event.status](event.message)
        }
      }
    }
  }
  datadogLogs.init(datadogLogsConfig)

  datadogRum.init({
    ...CLIENT_CONFIG,
    clientToken,
    applicationId,
    trackUserInteractions: true,
    defaultPrivacyLevel: 'mask-user-input',
    silentMultipleInit: true,

    allowedTracingUrls: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT
      ? [process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT]
      : undefined,
  })
  datadogRum.startSessionReplayRecording()
}
