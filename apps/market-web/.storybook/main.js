const path = require('path')
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin')

module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: '@storybook/react',
  staticDirs: ['./assets'],
  // TODO: remove when upgrading to storybook v7 (https://github.com/storybookjs/storybook/pull/13300)
  webpackFinal: async (config) => {
    const emotionReactEleven = path.dirname(require.resolve('@emotion/react/package.json'))
    const emotionStyledEleven = path.dirname(require.resolve('@emotion/styled/package.json'))
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '@emotion/core': emotionReactEleven,
          '@emotion/styled': emotionStyledEleven,
        },
        plugins: [
          new TsconfigPathsPlugin({
            extensions: config.resolve.extensions,
          }),
        ],
      },
    }
  },
}
