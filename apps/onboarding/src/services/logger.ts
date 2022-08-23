import { LoggerOptions, pino } from 'pino'

const pinoConf: LoggerOptions = {
  level: 'trace',
}

const logger = pino(
  pinoConf,
  // pino.transport({
  //   target: 'pino-datadog-transport',
  //   options: {
  //     ddClientConf: {
  //       authMethods: {
  //         apiKeyAuth: process.env.DATADOG_API_KEY,
  //       },
  //     },
  //     ddServerConf: {
  //       site: 'datadoghq.eu',
  //     },
  //     // URL will be racoon-onboarding.vercel.app when deployed on Vercel, but empty string when running locally.
  //     //       // NEXT_PUBLIC_DATADOG_SERVICE_NAME will be racoon-onboarding, so this is just a way to set a meaningful
  //     //       // service name when running locally.
  //     service: process.env.VERCEL_URL || `${process.env.NEXT_PUBLIC_DATADOG_SERVICE_NAME}.local`,
  //     ddsource: 'nodejs',
  //   },
  // }),
)

// const logger = pino(
//   pino.transport({
//     target: 'pino-datadog-transport',
//     options: {
//       ddClientConf: {
//         authMethods: {
//           apiKeyAuth: process.env.DATADOG_API_KEY,
//         },
//       },
//       ddServerConf: {
//         site: 'datadoghq.eu',
//       },
//       // URL will be racoon-onboarding.vercel.app when deployed on Vercel, but empty string when running locally.
//       // NEXT_PUBLIC_DATADOG_SERVICE_NAME will be racoon-onboarding, so this is just a way to set a meaningful
//       // service name when running locally.
//       service: process.env.VERCEL_URL || `${process.env.NEXT_PUBLIC_DATADOG_SERVICE_NAME}.local`,
//       ddsource: 'nodejs',
//     },
//   }),
// )

// const logger = pino(
//   pino.transport({
//     targets: [
//       {
//         target: 'pino-datadog-transport',
//         options: {
//           ddClientConf: {
//             authMethods: {
//               apiKeyAuth: process.env.DATADOG_API_KEY,
//             },
//           },
//           ddServerConf: {
//             site: 'datadoghq.eu',
//           },
//           // URL will be racoon-onboarding.vercel.app when deployed on Vercel, but empty string when running locally.
//           // NEXT_PUBLIC_DATADOG_SERVICE_NAME will be racoon-onboarding, so this is just a way to set a meaningful
//           // service name when running locally.
//           service:
//             process.env.VERCEL_URL || `${process.env.NEXT_PUBLIC_DATADOG_SERVICE_NAME}.local`,
//           ddsource: 'nodejs',
//         },
//         level: 'info',
//       },
//       { target: 'pino-pretty', options: { destination: 1 }, level: 'info' },
//     ],
//   }),
// )

export default logger
