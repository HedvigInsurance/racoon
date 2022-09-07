import { datadogLogs } from '@datadog/browser-logs'

export class Track {
  public static addContext(key: string, value: any) {
    datadogLogs.logger.addContext(key, value)
  }
}
