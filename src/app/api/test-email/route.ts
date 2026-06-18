import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

export async function GET() {
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.FROM_EMAIL ?? "Ania's Salon <onboarding@resend.dev>"
  const adminEmail = process.env.ADMIN_EMAIL

  if (!apiKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY is not set' }, { status: 500 })
  }
  if (!adminEmail) {
    return NextResponse.json({ error: 'ADMIN_EMAIL is not set' }, { status: 500 })
  }

  try {
    const resend = new Resend(apiKey)
    const result = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: "✅ Test email from Ania's Salon",
      html: '<p>Email is working correctly.</p>',
    })
    return NextResponse.json({ ok: true, id: result.data?.id, from: fromEmail, to: adminEmail })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
