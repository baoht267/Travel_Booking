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

function normalizeSouvenir(data) {
  return {
    name: String(data.name || '').trim(),
    description: String(data.description || '').trim(),
    image: String(data.image || '').trim(),
    category: String(data.category || '').trim(),
    origin: String(data.origin || '').trim(),
    originalPrice: Number(data.originalPrice),
    currentPrice: Number(data.currentPrice),
    stock: Number(data.stock),
  }
}

function validateSouvenir(souvenir) {
  if (!souvenir.name) return 'Souvenir name is required'
  if (!souvenir.description) return 'Description is required'
  if (!souvenir.image) return 'Image URL is required'
  if (!souvenir.category) return 'Category is required'
  if (!Number.isFinite(souvenir.originalPrice) || souvenir.originalPrice <= 0) {
    return 'Original price must be greater than 0'
  }
  if (!Number.isFinite(souvenir.currentPrice) || souvenir.currentPrice <= 0) {
    return 'Current price must be greater than 0'
  }
  if (souvenir.currentPrice > souvenir.originalPrice) {
    return 'Current price cannot be greater than original price'
  }
  if (!Number.isInteger(souvenir.stock) || souvenir.stock < 0) {
    return 'Stock must be an integer of 0 or more'
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

  if (parts[0] !== 'souvenirs' || parts.length > 2) {
    sendJson(response, 404, { message: 'Endpoint not found' })
    return
  }

  try {
    const db = await readDb()
    const souvenirs = Array.isArray(db.souvenirs) ? db.souvenirs : []
    const id = parts[1]

    if (request.method === 'GET' && !id) {
      sendJson(response, 200, souvenirs)
      return
    }

    if (request.method === 'GET' && id) {
      const souvenir = souvenirs.find((item) => item.id === id)
      sendJson(response, souvenir ? 200 : 404, souvenir || { message: 'Souvenir not found' })
      return
    }

    if (request.method === 'POST' && !id) {
      const payload = normalizeSouvenir(await readBody(request))
      const error = validateSouvenir(payload)
      if (error) {
        sendJson(response, 400, { message: error })
        return
      }

      const souvenir = {
        id: `sou-${Date.now().toString(36)}`,
        ...payload,
      }
      db.souvenirs = [souvenir, ...souvenirs]
      await writeDb(db)
      sendJson(response, 201, souvenir)
      return
    }

    if (request.method === 'PUT' && id) {
      const index = souvenirs.findIndex((item) => item.id === id)
      if (index === -1) {
        sendJson(response, 404, { message: 'Souvenir not found' })
        return
      }

      const payload = normalizeSouvenir(await readBody(request))
      const error = validateSouvenir(payload)
      if (error) {
        sendJson(response, 400, { message: error })
        return
      }

      const souvenir = { id, ...payload }
      db.souvenirs = souvenirs.map((item) => (item.id === id ? souvenir : item))
      await writeDb(db)
      sendJson(response, 200, souvenir)
      return
    }

    if (request.method === 'DELETE' && id) {
      const exists = souvenirs.some((item) => item.id === id)
      if (!exists) {
        sendJson(response, 404, { message: 'Souvenir not found' })
        return
      }

      db.souvenirs = souvenirs.filter((item) => item.id !== id)
      await writeDb(db)
      sendJson(response, 200, { id })
      return
    }

    sendJson(response, 405, { message: 'Method not allowed' })
  } catch (error) {
    sendJson(response, 500, { message: error.message || 'Server error' })
  }
}).listen(PORT, () => {
  console.log(`Travel souvenir API running at http://localhost:${PORT}`)
})
