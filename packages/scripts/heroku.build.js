#! /usr/bin/env node
const { spawn } = require('child_process')

const APPNAME = process.env.APPNAME || ''

function isValidAppName() {
  const validAppNames = ['racoon-onboarding', 'racoon-web']
  return validAppNames.includes(APPNAME)
}

function main() {
  if (!APPNAME || !isValidAppName()) {
    throw new Error('APPNAME env provided is invalid!')
  }

  let yarnBuild = null
  switch (appName) {
    case 'racoon-onboarding':
      yarnBuild = spawn('yarn', ['build:onboarding'])
      break
    case 'racoon-web':
      yarnBuild = spawn('yarn', ['build:web'])
      break
  }

  if (yarnBuild) {
    yarnBuild.stdout.on('data', (data) => console.log(`${data}`))
    yarnBuild.stderr.on('data', (data) => console.error(`${data}`))
    yarnBuild.on('close', (code) => console.log(`child process exited with code ${code}`))
  }
}

main()
