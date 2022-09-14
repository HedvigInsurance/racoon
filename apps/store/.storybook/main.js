module.exports = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', 'storybook-addon-next'],
  framework: '@storybook/react',
  features: {
    buildStoriesJson: true,
  },
  core: {
    builder: 'webpack5',
  },
}
