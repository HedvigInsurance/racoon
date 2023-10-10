import { TransformOptions } from '@babel/core'

export default {
  sourceType: 'unambiguous',
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: {
          chrome: 100,
        },
      },
    ],
    require.resolve('@babel/preset-typescript'),
    [require.resolve('@babel/preset-react'), { runtime: 'automatic' }],
  ],
  plugins: [require.resolve('@emotion/babel-plugin')],
} as TransformOptions
