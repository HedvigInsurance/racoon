module.exports = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: '@storybook/react',
  features: {
    buildStoriesJson: true,
  },
  refs: {
    store: {
      title: 'Hedvig.com',
      url: 'http://localhost:6008',
    },
  },
  core: {
    builder: 'webpack5',
  },
}
