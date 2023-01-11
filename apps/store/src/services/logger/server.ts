import { LoggerOptions, pino } from 'pino'
// These imports need to be here even though they're not used, otherwise Vercel will not include the code and logging fails once code is deployed
import 'pino-datadog-transport'
import 'pino-pretty'
import { SERVER_CONFIG } from './config'

const isLocalDev = ['dev', 'local'].includes(SERVER_CONFIG.env)

const pinoConf: LoggerOptions = {
  level: 'info',
  // base object attached to all logs. For some reason host can be added here but not in `options` in target object below...
  base: {
    host: SERVER_CONFIG.host,
  },
}

const targets = [
  {
    target: 'pino-datadog-transport',
    options: {
      ddServerConf: {
        site: SERVER_CONFIG.site,
      },
      ddClientConf: {
        authMethods: {
          apiKeyAuth: SERVER_CONFIG.apiKey,
        },
      },
      ddsource: 'nodejs',
      ddtags: `env:${SERVER_CONFIG.env}`,
      service: SERVER_CONFIG.service,
      sendImmediate: true, // send logs immediately instead of bulking
    },
  } as any,
]

if (isLocalDev) {
  targets.push({
    target: 'pino-pretty',
  })
}

const logger = pino(
  pinoConf,
  pino.transport({
    targets,
  }),
)

export default logger
