import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

export async function GET() {
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.FROM_EMAIL ?? "Ania's Salon <onboarding@resend.dev>"
  const adminEmail = process.env.ADMIN_EMAIL

  if (!apiKey) return NextResponse.json({ error: 'RESEND_API_KEY is not set' }, { status: 500 })
  if (!adminEmail) return NextResponse.json({ error: 'ADMIN_EMAIL is not set' }, { status: 500 })

  const resend = new Resend(apiKey)
  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: adminEmail,
    subject: "✅ Test email from Ania's Salon",
    html: '<p>Email is working correctly.</p>',
  })

  if (error) {
    return NextResponse.json({ error: error.message, details: error }, { status: 500 })
  }

  return NextResponse.json({ ok: true, id: data?.id, from: fromEmail, to: adminEmail })
}
