import express from 'express'
import multer from 'multer'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { root, uploadsDir } from './db.mjs'
import { createAuthRouter } from './auth.mjs'
import { createPublicRouter } from './routes/public.mjs'
import { createAdminRouter } from './routes/admin.mjs'
import { seed } from './seed.mjs'

const app = express()
const port = Number(process.env.PORT || 8787)

seed()

app.use(express.json({ limit: '1mb' }))
app.use('/uploads', express.static(uploadsDir))

app.use('/api/auth', createAuthRouter())
app.use('/api', createPublicRouter())
app.use('/api/admin', createAdminRouter())

app.use((error, _req, res, _next) => { 
  if (error instanceof multer.MulterError) return res.status(400).json({ error: 'UPLOAD_ERROR' })
  console.error(error)
  res.status(500).json({ error: 'SERVER_ERROR' }) 
})

const dist = join(root, 'dist')
if (existsSync(dist)) { 
  app.use(express.static(dist))
  app.use((_req, res) => res.sendFile(join(dist, 'index.html'))) 
}

app.listen(port, () => console.log(`School API is running at http://localhost:${port}`))
