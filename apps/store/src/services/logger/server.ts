import { LoggerOptions, pino } from 'pino'
// These imports need to be here even though they're not used, otherwise Vercel will not include the code and logging fails once code is deployed
import 'pino-pretty'

const pinoConf: LoggerOptions = {
  level: 'info',
}

const targets = [
  {
    target: 'pino-pretty',
    options: {
      ignore: 'pid,hostname',
    },
    level: 'info',
  },
]

const logger = pino(
  pinoConf,
  pino.transport({
    targets,
  }),
)

export default logger
