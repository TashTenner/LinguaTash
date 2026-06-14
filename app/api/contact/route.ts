import { NextRequest, NextResponse } from 'next/server'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; message?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, email, message } = body
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Faltan campos obligatorios.' }, { status: 400 })
  }

  const toEmail = process.env.CONTACT_EMAIL ?? 'tashfonetikas@gmail.com'

  const res = await fetch('https://api.mailersend.com/v1/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MAILERSEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: {
        email: process.env.MAILERSEND_FROM_EMAIL,
        name: process.env.MAILERSEND_FROM_NAME ?? 'LinguaTash',
      },
      to: [{ email: toEmail, name: 'Tash' }],
      reply_to: { email: email.trim(), name: name.trim() },
      subject: `Mensaje de ${name.trim()} — LinguaTash`,
      html: `
        <p><strong>Nombre:</strong> ${escapeHtml(name.trim())}</p>
        <p><strong>Email:</strong> ${escapeHtml(email.trim())}</p>
        <hr>
        <p>${escapeHtml(message.trim()).replace(/\n/g, '<br>')}</p>
      `,
      text: `Nombre: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('[contact] Mailersend error:', err)
    return NextResponse.json({ error: 'Error al enviar el mensaje.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
