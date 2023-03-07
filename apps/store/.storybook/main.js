module.exports = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-addon-next',
    'storybook-addon-next-router',
  ],
  framework: '@storybook/react',
  features: {
    buildStoriesJson: true,
  },
  core: {
    builder: 'webpack5',
  },
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
