import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import contactRouter from './routes/contact.js'

const app = express()
const port = Number(process.env.PORT || 3001)

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json({ limit: '20kb' }))
app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api/contact', contactRouter)
app.use((_req, res) => res.status(404).json({ error: 'Not found' }))

app.listen(port, () => console.log(`Portfolio API listening on port ${port}`))
