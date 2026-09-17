import nodemailer from 'nodemailer'

const requiredEnv = ['EMAIL_USER', 'EMAIL_PASSWORD', 'OWNER_EMAIL']

function getTransporter() {
  for (const key of requiredEnv) {
    if (!process.env[key]) throw new Error(`Missing ${key} environment variable`)
  }
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
  })
}

export async function sendContactEmails({ name, email, message }) {
  const transporter = getTransporter()
  const ownerSubject = `New Portfolio Contact — ${name}`
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.OWNER_EMAIL,
    replyTo: email,
    subject: ownerSubject,
    text: `New message received from your portfolio.\n\nName:\n${name}\n\nEmail:\n${email}\n\nMessage:\n${message}\n\nReceived from:\nOm Satote Portfolio`,
  })
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Thank you for connecting with Om Satote',
    text: `Hi ${name},\n\nThank you for reaching out through my portfolio.\n\nI’ve received your message and appreciate you taking the time to connect.\n\nI’ll get back to you as soon as possible.\n\nLet's stay connected:\n\nLinkedIn → ${process.env.LINKEDIN_URL}\nGitHub → ${process.env.GITHUB_URL}\nLinktree → ${process.env.LINKTREE_URL}\nWhatsApp → ${process.env.WHATSAPP_URL}\n\nBest regards,\n\nOm Satote\nComputer Engineering Student | Full-Stack Developer`,
  })
}
