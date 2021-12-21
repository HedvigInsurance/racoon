module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  plugins: ['testing-library'],
  settings: {
    next: {
      rootDir: ['apps/*/', 'packages/*/'],
    },
  },
}
