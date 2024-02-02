const jsLexer = [
  {
    lexer: 'JavascriptLexer',
    functions: ['t', 'tKey'],
    namespaceFunctions: ['useTranslation', 'setI18nNamespace'],
  },
]

module.exports = {
  input: ['src/**/*.{ts,tsx}'],
  locales: ['en'],
  defaultNamespace: 'common',
  output: 'public/locales/$LOCALE/$NAMESPACE.json',
  verbose: true,
  keepRemoved: false,
  lexers: {
    ts: jsLexer,
  },
  // Workaround to make local sort match Lokalize rules
  sort: (a, b) => a.localeCompare(b, 'en', { sensitivity: 'base', ignorePunctuation: true }),
}
