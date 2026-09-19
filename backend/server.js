import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import contactRouter from './routes/contact.js'

const app = express()
const port = Number(process.env.PORT || 3001)
const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const frontendDirectory = path.resolve(currentDirectory, '../dist')

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json({ limit: '20kb' }))
app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api/contact', contactRouter)
app.use(express.static(frontendDirectory))
app.get(/.*/, (_req, res) => res.sendFile(path.join(frontendDirectory, 'index.html')))

app.listen(port, '0.0.0.0', () => console.log(`Portfolio API listening on port ${port}`))
