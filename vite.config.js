import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// host: true и allowedHosts: true нужны, чтобы открыть dev-сервер
// через туннель (ngrok, cloudflared) внутри Telegram.
export default defineConfig({
  plugins: [react()],
  server: { host: true, allowedHosts: true },
})
