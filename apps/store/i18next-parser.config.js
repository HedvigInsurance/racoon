module.exports = {
  input: ['src/**/*.{ts,tsx}'],
  locales: ['en'],
  defaultNamespace: 'common',
  output: 'public/locales/$LOCALE/$NAMESPACE.json',
  verbose: true,
  keepRemoved: true,
  // Workaround to make local sort match Lokalize rules
  sort: (a, b) => a.localeCompare(b, 'en', { sensitivity: 'base', ignorePunctuation: true }),
}
