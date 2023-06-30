import { registerOTel } from '@vercel/otel'

const name = process.env.NEXT_PUBLIC_DATADOG_SERVICE_NAME ?? 'racoon-store'

export const register = () => {
  console.log('Registering OpenTelemetry')
  registerOTel(name)
}
