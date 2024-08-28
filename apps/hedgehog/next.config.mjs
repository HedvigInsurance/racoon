import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'

const withVanillaExtract = createVanillaExtractPlugin({
  transpilePackages: ['ui'],
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: './dist', // Changes the build output directory to `./dist/`.
  output: 'standalone', // Needed for the Docker image
  transpilePackages: ['ui'],
}

export default withVanillaExtract(nextConfig)
