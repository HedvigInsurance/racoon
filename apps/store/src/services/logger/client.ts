import { datadogLogs, LogsInitConfiguration } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import { Tracking } from '@/services/Tracking/Tracking'
import { CLIENT_CONFIG } from './config'

const APPLICATION_ID = process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID
const CLIENT_TOKEN = process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN

export const initDatadog = () => {
  if (APPLICATION_ID && CLIENT_TOKEN) {
    const datadogLogsConfig: LogsInitConfiguration = {
      ...CLIENT_CONFIG,
      clientToken: CLIENT_TOKEN,
      forwardErrorsToLogs: true,
    }

    if (CLIENT_CONFIG.env === 'dev') {
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
      clientToken: CLIENT_TOKEN,
      applicationId: APPLICATION_ID,
      trackInteractions: true,
      defaultPrivacyLevel: 'mask-user-input',
      silentMultipleInit: true,

      allowedTracingOrigins: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT
        ? [process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT]
        : undefined,
    })
    datadogRum.startSessionReplayRecording()
  }
}
