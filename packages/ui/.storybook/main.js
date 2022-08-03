const path = require('path')

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: '@storybook/react',
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
          '@emotion/styled': emotionStyledEleven,
        },
      },
    }
  },
}
