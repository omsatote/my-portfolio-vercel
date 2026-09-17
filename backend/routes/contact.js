import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { sendContactEmails } from '../services/emailService.js'

const router = Router()
const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: 'Too many messages. Please try again later.' } })

function validateContact(body) {
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''
  const errors = {}
  if (name.length < 2) errors.name = 'Name must be at least 2 characters.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.'
  if (message.length < 10) errors.message = 'Message must be at least 10 characters.'
  return { name, email, message, errors }
}

router.post('/', contactLimiter, async (req, res) => {
  const contact = validateContact(req.body || {})
  if (Object.keys(contact.errors).length) return res.status(400).json({ error: 'Please check the form fields.', fields: contact.errors })
  try {
    await sendContactEmails(contact)
    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Contact email failed:', error.message)
    return res.status(500).json({ error: 'Unable to send message right now.' })
  }
})

export default router
