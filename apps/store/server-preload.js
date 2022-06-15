// @ts-check
'use strict'

/**
 * Reference: https://jake.tl/notes/2021-04-04-nextjs-preload-hack
 */

/**
 * Set up datadog tracing. This should be called first, so Datadog can hook
 * all the other dependencies like `http`.
 */
const setUpDatadogTracing = () => {
  const { tracer: Tracer } = require('dd-trace')
  Tracer.init({
    // Your options here.
    runtimeMetrics: true,
    logInjection: true,
    version: process.env.VERCEL_GIT_COMMIT_SHA,
  })
}

setUpDatadogTracing()
