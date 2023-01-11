import { LoggerOptions, pino, TransportTargetOptions } from 'pino'
// These imports need to be here even though they're not used, otherwise Vercel will not include the code and logging fails once code is deployed
import 'pino-pretty'

const pinoConf: LoggerOptions = {
  level: 'info',
}

const targets: TransportTargetOptions[] = []
if (process.env.NODE_ENV !== 'production') {
  targets.push({
    target: 'pino-pretty',
    options: {
      ignore: 'time,pid,hostname',
    },
    level: 'info',
  })
}

const transport = targets.length > 0 ? pino.transport({ targets }) : undefined
const logger = pino(pinoConf, transport)

export default logger
