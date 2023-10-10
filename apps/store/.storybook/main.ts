import type { StorybookConfig } from '@storybook/nextjs'
import babelConfig from './babelConfig'

const path = require('path')
// Extracted inline declarations from storybook docs for supporting PNP mode
// Just specifying package name no longer works
const resolveDependency = (npmName) =>
  path.dirname(require.resolve(path.join(npmName, 'package.json')))

const config: StorybookConfig = {
  stories: [
    {
      directory: '../../../packages/ui/src',
      files: '**/*.stories.@(ts|tsx|mdx)',
      titlePrefix: 'UI Kit',
    },
    '../src/**/*.stories.@(ts|tsx|mdx)',
  ],
  addons: [
    resolveDependency('@storybook/addon-links'),
    resolveDependency('@storybook/addon-essentials'),
    resolveDependency('storybook-addon-apollo-client'),
    resolveDependency('@storybook/addon-designs'),
  ],
  framework: {
    name: resolveDependency('@storybook/nextjs'),
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
