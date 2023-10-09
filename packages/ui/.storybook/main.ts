import type { StorybookConfig } from '@storybook/react-webpack5'
import babelConfig from './babelConfig'

const path = require('path')
const resolveDependency = (npmName) =>
  path.dirname(require.resolve(path.join(npmName, 'package.json')))

const config: StorybookConfig = {
  stories: [
    {
      directory: '../src',
      titlePrefix: 'UI Kit',
      files: '**/*.stories.*',
    },
  ],
  addons: [
    resolveDependency('@storybook/addon-links'),
    resolveDependency('@storybook/addon-essentials'),
  ],
  framework: {
    name: resolveDependency('@storybook/react-webpack5'),
    options: {},
  },
  features: {
    buildStoriesJson: true,
  },
  babel: () => babelConfig,
}

export default config
