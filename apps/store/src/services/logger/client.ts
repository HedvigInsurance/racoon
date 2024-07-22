import type { LogsInitConfiguration } from '@datadog/browser-logs'
import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import { useEffect } from 'react'
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
  sessionSampleRate: 100,
  service: process.env.NEXT_PUBLIC_DATADOG_SERVICE_NAME,
  site: 'datadoghq.eu',
  version,
  silentMultipleInit: true,
}

const applicationId = process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID
const clientToken = process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN

const initDatadog = () => {
  // Misconfiguration, should not happen in practive
  if (!applicationId || !clientToken) return
  // Already initialized
  if (datadogLogs.getInitConfiguration() != null) return

  window.performance.mark('initDatadog')

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
          console.log('tracking event', event.message, event)
        } else {
          console.log(event.message)
        }
      }
      return true
    }
  }
  datadogLogs.init(datadogLogsConfig)
  datadogRum.init({
    ...CLIENT_CONFIG,
    clientToken,
    applicationId,
    trackUserInteractions: true,

    sessionReplaySampleRate: 100,
    defaultPrivacyLevel: 'mask-user-input',

    allowedTracingUrls: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT
      ? [process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT]
      : undefined,
  })
  datadogRum.startSessionReplayRecording()
}

// Should be used in top-level app component
export const useInitDatadogAfterInteractive = () => {
  useEffect(() => {
    // It's safe to use datadog before init, so we want to delay initialization until after page is interactive
    // Ensure it works in Safari (no requestIdleCallback)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const delay = window.requestIdleCallback ?? window.setTimeout
    delay(initDatadog)
  }, [])
}
