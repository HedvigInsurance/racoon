#! /usr/bin/env node
const { exec } = require('child_process')

const APPNAME = process.env.APPNAME || ''

function isValidAppName() {
  const validAppNames = ['racoon-onboarding', 'racoon-market-web']
  return validAppNames.includes(APPNAME)
}

function main() {
  if (!isValidAppName()) {
    throw new Error('APPNAME env provided is invalid!')
  }

  let filterPattern = null
  switch (APPNAME) {
    case 'racoon-onboarding':
      filterPattern = 'onboarding'
      break
    case 'racoon-market-web':
      filterPattern = 'market-web'
      break
  }

  if (filterPattern != null) {
    const buildCommand = exec(`npx turbo run build --filter=${filterPattern}`)

    buildCommand.stdout.on('data', (data) => console.log(`${data}`))
    buildCommand.stderr.on('data', (data) => console.error(`${data}`))
    buildCommand.on('close', (code) => console.log(`child process exited with code ${code}`))
  }
}

main()
