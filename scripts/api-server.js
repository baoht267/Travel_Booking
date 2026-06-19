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

function normalizeDestination(data) {
  return {
    name: String(data.name || '').trim(),
    description: String(data.description || '').trim(),
    image: String(data.image || '').trim(),
    country: String(data.country || '').trim(),
    city: String(data.city || '').trim(),
    originalPrice: Number(data.originalPrice),
    currentPrice: Number(data.currentPrice),
  }
}

function validateDestination(destination) {
  if (!destination.name) return 'Destination name is required'
  if (!destination.description) return 'Description is required'
  if (!destination.image) return 'Image URL is required'
  if (!destination.country) return 'Country is required'
  if (!destination.city) return 'City is required'
  if (!Number.isFinite(destination.originalPrice) || destination.originalPrice <= 0) {
    return 'Original price must be greater than 0'
  }
  if (!Number.isFinite(destination.currentPrice) || destination.currentPrice <= 0) {
    return 'Current price must be greater than 0'
  }
  if (destination.currentPrice > destination.originalPrice) {
    return 'Current price cannot be greater than original price'
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

  if (parts[0] !== 'destinations' || parts.length > 2) {
    sendJson(response, 404, { message: 'Endpoint not found' })
    return
  }

  try {
    const db = await readDb()
    const destinations = Array.isArray(db.destinations) ? db.destinations : []
    const id = parts[1]

    if (request.method === 'GET' && !id) {
      sendJson(response, 200, destinations)
      return
    }

    if (request.method === 'GET' && id) {
      const destination = destinations.find((item) => item.id === id)
      sendJson(response, destination ? 200 : 404, destination || { message: 'Destination not found' })
      return
    }

    if (request.method === 'POST' && !id) {
      const payload = normalizeDestination(await readBody(request))
      const error = validateDestination(payload)
      if (error) {
        sendJson(response, 400, { message: error })
        return
      }

      const destination = {
        id: `des-${Date.now().toString(36)}`,
        ...payload,
      }
      db.destinations = [destination, ...destinations]
      await writeDb(db)
      sendJson(response, 201, destination)
      return
    }

    if (request.method === 'PUT' && id) {
      const index = destinations.findIndex((item) => item.id === id)
      if (index === -1) {
        sendJson(response, 404, { message: 'Destination not found' })
        return
      }

      const payload = normalizeDestination(await readBody(request))
      const error = validateDestination(payload)
      if (error) {
        sendJson(response, 400, { message: error })
        return
      }

      const destination = { id, ...payload }
      db.destinations = destinations.map((item) => (item.id === id ? destination : item))
      await writeDb(db)
      sendJson(response, 200, destination)
      return
    }

    if (request.method === 'DELETE' && id) {
      const exists = destinations.some((item) => item.id === id)
      if (!exists) {
        sendJson(response, 404, { message: 'Destination not found' })
        return
      }

      db.destinations = destinations.filter((item) => item.id !== id)
      await writeDb(db)
      sendJson(response, 200, { id })
      return
    }

    sendJson(response, 405, { message: 'Method not allowed' })
  } catch (error) {
    sendJson(response, 500, { message: error.message || 'Server error' })
  }
}).listen(PORT, () => {
  console.log(`Travel destination API running at http://localhost:${PORT}`)
})
