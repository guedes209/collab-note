const { setupWSConnection } = require('y-websocket/bin/utils')
const { WebSocketServer } = require('ws')
const http = require('http')

const port = process.env.PORT || 1234

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Yjs WebSocket Signaling Server is running')
})

const wss = new WebSocketServer({ server })

wss.on('connection', (conn, req) => {
  console.log('🔌 Novo cliente conectado!')
  setupWSConnection(conn, req, { gc: true })
})

server.listen(port, () => {
  console.log(`✅ Signaling server running at ws://localhost:${port}`)
})
