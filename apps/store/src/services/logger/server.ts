import { LoggerOptions, pino } from 'pino'
// These imports need to be here even though they're not used, otherwise Vercel will not include the code and logging fails once code is deployed
import 'pino-datadog-transport'
import 'pino-pretty'
import { SERVER_CONFIG } from './config'

const isLocalDev = ['dev', 'local'].includes(SERVER_CONFIG.env)

const pinoConf: LoggerOptions = {
  level: 'info',
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
      sendImmediate: isLocalDev, // send logs immediately for local dev instead of bulking
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
