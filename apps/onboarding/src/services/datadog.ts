import { datadogRum } from '@datadog/browser-rum'

const APPLICATION_ID = process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID
const CLIENT_TOKEN = process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN

export const initRum = () => {
  if (APPLICATION_ID && CLIENT_TOKEN) {
    datadogRum.init({
      applicationId: APPLICATION_ID,
      clientToken: CLIENT_TOKEN,
      site: 'datadoghq.eu',
      service: 'racoon-onboarding',
      version: process.env.NEXT_PUBLIC_DATADOG_VERSION,
      env: process.env.NEXT_PUBLIC_DATADOG_ENV || 'dev',
      sampleRate: 100,
      trackInteractions: true,
      defaultPrivacyLevel: 'mask-user-input',
    })

    datadogRum.startSessionReplayRecording()
  }
}
