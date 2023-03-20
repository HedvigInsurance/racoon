import type { StorybookConfig } from '@storybook/react-webpack5'
import babelConfig from './babelConfig'

const config: StorybookConfig = {
  stories: [
    {
      directory: '../src',
      titlePrefix: 'UI',
      files: '**/*.stories.*',
    },
  ],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  features: {
    buildStoriesJson: true,
  },
  babel: () => babelConfig,
  refs: {
    store: {
      title: 'Hedvig.com',
      url: 'http://localhost:6008',
    },
  },
}

export default config
