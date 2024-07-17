import { fileURLToPath, URL } from 'node:url'

import { ConfigEnv, loadEnv, UserConfig, } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default ({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd());
  const port = env.VITE_PORT;
  const api = env.VITE_API_ENDPOINT;
  return {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      port: parseInt(port),
      proxy: {
        '/api': {
          target: api,
        },
      }
    }
  }
}