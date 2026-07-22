import { createServer } from 'node:http'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const PORT = Number(process.env.PORT || 4000)
const DB_PATH = resolve('db.json')

async function readDb() {
  const raw = await readFile(DB_PATH, 'utf8')
  return JSON.parse(raw)
}

async function writeDb(db) {
  await writeFile(DB_PATH, JSON.stringify(db, null, 2) + '\n')
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  })
  response.end(JSON.stringify(payload))
}

function readBody(request) {
  return new Promise((resolveBody, rejectBody) => {
    let body = ''
    request.on('data', (chunk) => {
      body += chunk
    })
    request.on('end', () => {
      try {
        resolveBody(body ? JSON.parse(body) : {})
      } catch {
        rejectBody(new Error('Invalid JSON body'))
      }
    })
  })
}

function normalizeRoom(data) {
  return {
    name: String(data.name || '').trim(),
    description: String(data.description || '').trim(),
    image: String(data.image || '').trim(),
    location: String(data.location || '').trim(),
    originalPrice: Number(data.originalPrice),
    currentPrice: Number(data.currentPrice),
  }
}

function validateRoom(room) {
  if (!room.name) return 'Tên phòng là bắt buộc'
  if (!room.description) return 'Mô tả là bắt buộc'
  if (!room.image) return 'Đường dẫn ảnh là bắt buộc'
  if (!room.location) return 'Địa chỉ là bắt buộc'
  if (!Number.isFinite(room.originalPrice) || room.originalPrice <= 0) {
    return 'Giá gốc phải lớn hơn 0'
  }
  if (!Number.isFinite(room.currentPrice) || room.currentPrice <= 0) {
    return 'Giá hiện tại phải lớn hơn 0'
  }
  if (room.currentPrice > room.originalPrice) {
    return 'Giá hiện tại không được lớn hơn giá gốc'
  }
  return null
}

createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    sendJson(response, 204, {})
    return
  }

  const url = new URL(request.url, `http://localhost:${PORT}`)
  const parts = url.pathname.split('/').filter(Boolean)

  if (parts[0] !== 'rooms' || parts.length > 2) {
    sendJson(response, 404, { message: 'Endpoint not found' })
    return
  }

  try {
    const db = await readDb()
    const rooms = Array.isArray(db.rooms) ? db.rooms : []
    const id = parts[1]

    if (request.method === 'GET' && !id) {
      sendJson(response, 200, rooms)
      return
    }

    if (request.method === 'GET' && id) {
      const room = rooms.find((item) => item.id === id)
      sendJson(response, room ? 200 : 404, room || { message: 'Không tìm thấy phòng' })
      return
    }

    if (request.method === 'POST' && !id) {
      const payload = normalizeRoom(await readBody(request))
      const error = validateRoom(payload)
      if (error) {
        sendJson(response, 400, { message: error })
        return
      }

      const room = {
        id: `room-${Date.now().toString(36)}`,
        ...payload,
      }
      db.rooms = [room, ...rooms]
      await writeDb(db)
      sendJson(response, 201, room)
      return
    }

    if (request.method === 'PUT' && id) {
      const index = rooms.findIndex((item) => item.id === id)
      if (index === -1) {
        sendJson(response, 404, { message: 'Không tìm thấy phòng' })
        return
      }

      const payload = normalizeRoom(await readBody(request))
      const error = validateRoom(payload)
      if (error) {
        sendJson(response, 400, { message: error })
        return
      }

      const room = { id, ...payload }
      db.rooms = rooms.map((item) => (item.id === id ? room : item))
      await writeDb(db)
      sendJson(response, 200, room)
      return
    }

    if (request.method === 'DELETE' && id) {
      const exists = rooms.some((item) => item.id === id)
      if (!exists) {
        sendJson(response, 404, { message: 'Không tìm thấy phòng' })
        return
      }

      db.rooms = rooms.filter((item) => item.id !== id)
      await writeDb(db)
      sendJson(response, 200, { id })
      return
    }

    sendJson(response, 405, { message: 'Method not allowed' })
  } catch (error) {
    sendJson(response, 500, { message: error.message || 'Server error' })
  }
}).listen(PORT, () => {
  console.log(`Room API running at http://localhost:${PORT}`)
})
