if (typeof window === 'undefined') {
  const { server } = require('mocks/server')
  server.listen({ onUnhandledRequest: 'bypass' })
} else {
  const { worker } = require('mocks/browser')
  worker.start({ onUnhandledRequest: 'bypass' })
}
export {}
