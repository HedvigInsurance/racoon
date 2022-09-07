import { datadogLogs, LogsInitConfiguration } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'

const APPLICATION_ID = process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID
const CLIENT_TOKEN = process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN
const VERSION =
  process.env.NEXT_PUBLIC_DATADOG_VERSION || process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
const ENV = process.env.NEXT_PUBLIC_DATADOG_ENV || 'dev'

const COMMON_CONFIG = {
  site: 'datadoghq.eu',
  service: 'racoon-store',
  sampleRate: 100,
  version: VERSION,
  env: ENV,
}

export const initDatadog = () => {
  if (APPLICATION_ID && CLIENT_TOKEN) {
    datadogRum.init({
      ...COMMON_CONFIG,
      clientToken: CLIENT_TOKEN,
      applicationId: APPLICATION_ID,
      trackInteractions: true,
      defaultPrivacyLevel: 'mask-user-input',
    })

    datadogRum.startSessionReplayRecording()

    const datadogLogsConfig: LogsInitConfiguration = {
      ...COMMON_CONFIG,
      clientToken: CLIENT_TOKEN,
      forwardErrorsToLogs: true,
    }

    if (ENV === 'dev') {
      datadogLogsConfig.beforeSend = (event) => {
        console[event.status](event.message)
      }
    }

    datadogLogs.init(datadogLogsConfig)
  }
}
