const consolePatched = Symbol('consolePatched')

const ignoredWarnings = new Set([
  // Nothing we can do about it, nextjs loads datadog SDK multiple times when doing server-side code splitting
  // Source of warning: https://github.com/DataDog/browser-sdk/blob/92d7ab9426b5e4e2bcf7e8dcd5852c8ab635cbb4/packages/core/src/boot/init.ts#L53
  'Datadog Browser SDK: SDK is loaded more than once. This is unsupported and might have unexpected behavior.',
])

export const patchServerConsole = () => {
  if (typeof window !== 'undefined') return
  if (console[consolePatched] != null) return

  console[consolePatched] = true

  const origWarn = console.warn
  console.warn = (...args) => {
    if (ignoredWarnings.has(args.join(' '))) {
      return
    }
    origWarn(...args)
  }
}
