import type { StorybookConfig } from '@storybook/nextjs'
import babelConfig from './babelConfig'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-addon-apollo-client',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  features: {
    buildStoriesJson: true,
  },
  babel: () => babelConfig,
  webpackFinal: (config) => {
    /**
     * Fixes issue with `next-i18next` and is ready for webpack@5
     * @see https://github.com/isaachinman/next-i18next/issues/1012#issuecomment-792697008
     * @see https://github.com/storybookjs/storybook/issues/4082#issuecomment-758272734
     * @see https://webpack.js.org/migrate/5/
     */
    config.resolve.fallback = {
      fs: false,
      tls: false,
      net: false,
      module: false,
      path: require.resolve('path-browserify'),
      crypto: false,
    }
    return config
  },
}
export default config
