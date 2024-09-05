export const getEnvOrThrow = (name: string): string => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} not configured`)
  }
  return value
}
