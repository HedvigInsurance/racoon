import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import path from 'path'

export const alias = {
  '@hedvig-ui': path.resolve(__dirname, './src/@hedvig-ui'),
  '@hope': path.resolve(__dirname, './src/portals/hope'),
  portals: path.resolve(__dirname, './src/portals'),
  apollo: path.resolve(__dirname, './src/apollo'),
  auth: path.resolve(__dirname, './src/auth'),
  demo: path.resolve(__dirname, './src/demo'),
  types: path.resolve(__dirname, './src/types'),
  backoffice: path.resolve(__dirname, './src/backoffice'),
  src: path.resolve(__dirname, './src'),
  utils: path.resolve(__dirname, './src/utils'),
}

export default defineConfig(() => {
  return {
    server: {
      port: 9000,
    },
    resolve: {
      alias,
    },
    plugins: [react(), vanillaExtractPlugin()],
  }
})
