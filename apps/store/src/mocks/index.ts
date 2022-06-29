import { server } from './server'

server.listen({ onUnhandledRequest: 'bypass' })
