/**
 * Vite Plugin for Mock Server
 * 在 Vite 开发服务器中集成 mock 功能
 */

import { createServer } from 'http'
import { mockApiHandler } from './server.js'

export function viteMockPlugin(options = {}) {
  const { 
    enable = process.env.USE_MOCK === 'true',
    log = true,
    port = 8787
  } = options

  let server = null

  return {
    name: 'vite-mock-plugin',
    configureServer(devServer) {
      if (!enable) {
        if (log) console.log('🚫 Mock server disabled')
        return
      }

      if (log) {
        console.log('\n✅ Mock server enabled')
        console.log('📦 Mock API endpoints available:')
        console.log('   - GET/POST  /api/settings')
        console.log('   - GET/POST/PUT/DELETE /api/products')
        console.log('   - GET/POST/PUT /api/inquiries')
        console.log('   - GET /api/payment/orders')
        console.log('   - POST /api/admin/login')
        console.log('   - POST /api/upload/image')
      }

      server = createServer(async (req, res) => {
        const url = new URL(req.url, `http://${req.headers.host}`)
        
        if (log) {
          console.log(`[Mock] ${req.method} ${url.pathname}`)
        }

        try {
          await mockApiHandler(req, res, url)
        } catch (error) {
          console.error('[Mock Error]', error)
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Internal server error' }))
        }
      })

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.error(`\n❌ Port ${port} is already in use!`)
          console.error('Please close the other process using this port or change the mock server port.')
          console.error('You can kill the process with: lsof -ti:8787 | xargs kill\n')
        } else {
          console.error('[Mock Server Error]', err)
        }
      })

      server.listen(port, () => {
        if (log) {
          console.log(`🎭 Mock server listening on http://localhost:${port}\n`)
        }
      })

      devServer.httpServer.on('close', () => {
        if (server) {
          server.close()
        }
      })
    }
  }
}

export default viteMockPlugin
