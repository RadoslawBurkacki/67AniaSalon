import { Resend } from 'resend'
import { formatDate, formatTime } from './types'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.FROM_EMAIL ?? 'Anya\'s Salon <onboarding@resend.dev>'
const SALON_NAME = "Anya's Salon"
const SALON_PHONE = process.env.SALON_PHONE ?? ''
const SALON_ADDRESS = process.env.SALON_ADDRESS ?? ''

function baseTemplate(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${SALON_NAME}</title>
</head>
<body style="margin:0;padding:0;background:#f5f0ea;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0ea;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#0a0a0a;color:#f5f0ea;">
        <!-- Header -->
        <tr>
          <td style="padding:40px 40px 0;text-align:center;border-bottom:1px solid #2a2320;">
            <p style="margin:0 0 6px;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#8b7355;">Nails &amp; Massage</p>
            <h1 style="margin:0 0 24px;font-size:28px;font-weight:300;letter-spacing:3px;color:#c9a96e;">${SALON_NAME}</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr><td style="padding:36px 40px;">${content}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px;border-top:1px solid #2a2320;text-align:center;">
            ${SALON_PHONE ? `<p style="margin:0 0 4px;font-size:12px;color:#6a5f52;">${SALON_PHONE}</p>` : ''}
            ${SALON_ADDRESS ? `<p style="margin:0 0 4px;font-size:12px;color:#6a5f52;">${SALON_ADDRESS}</p>` : ''}
            <p style="margin:8px 0 0;font-size:11px;color:#3a3028;">&copy; ${new Date().getFullYear()} ${SALON_NAME}</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function detailsTable(rows: { label: string; value: string }[]) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
    ${rows.map(r => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #2a2320;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8b7355;width:40%;">${r.label}</td>
      <td style="padding:10px 0;border-bottom:1px solid #2a2320;font-size:14px;color:#f5f0ea;text-align:right;">${r.value}</td>
    </tr>`).join('')}
  </table>`
}

interface BookingDetails {
  id: string
  name: string
  email: string
  phone: string
  service_name: string
  service_category: string
  date: string
  time_slot: string
  duration_minutes: number
  notes?: string | null
}

export async function sendBookingReceived(booking: BookingDetails) {
  const body = `
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:300;color:#f5f0ea;">Booking Received</h2>
    <p style="margin:0 0 4px;font-size:14px;color:#a09080;">Hi ${booking.name},</p>
    <p style="margin:0 0 24px;font-size:14px;color:#a09080;line-height:1.6;">
      Thank you for booking with us. We've received your appointment request and will confirm it shortly.
    </p>
    ${detailsTable([
      { label: 'Service', value: booking.service_name },
      { label: 'Date', value: formatDate(booking.date) },
      { label: 'Time', value: formatTime(booking.time_slot) },
      { label: 'Duration', value: `${booking.duration_minutes} minutes` },
    ])}
    ${booking.notes ? `<p style="margin:0 0 24px;font-size:13px;color:#6a5f52;font-style:italic;">Note: ${booking.notes}</p>` : ''}
    <p style="margin:24px 0 0;font-size:13px;color:#6a5f52;line-height:1.6;">
      If you need to cancel or reschedule, please get in touch as soon as possible.
    </p>`

  const { error } = await resend.emails.send({
    from: FROM,
    to: booking.email,
    subject: `Booking received — ${booking.service_name} on ${formatDate(booking.date)}`,
    html: baseTemplate(body),
  })
  if (error) throw new Error(`Resend error: ${error.message}`)
}

export async function sendBookingConfirmed(booking: BookingDetails) {
  const body = `
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:300;color:#c9a96e;">Appointment Confirmed ✓</h2>
    <p style="margin:0 0 4px;font-size:14px;color:#a09080;">Hi ${booking.name},</p>
    <p style="margin:0 0 24px;font-size:14px;color:#a09080;line-height:1.6;">
      Great news — your appointment has been confirmed. We look forward to seeing you!
    </p>
    ${detailsTable([
      { label: 'Service', value: booking.service_name },
      { label: 'Date', value: formatDate(booking.date) },
      { label: 'Time', value: formatTime(booking.time_slot) },
      { label: 'Duration', value: `${booking.duration_minutes} minutes` },
    ])}
    <p style="margin:24px 0 0;font-size:13px;color:#6a5f52;line-height:1.6;">
      Please arrive 5 minutes early. If you need to cancel, please let us know at least 24 hours in advance.
    </p>`

  const { error } = await resend.emails.send({
    from: FROM,
    to: booking.email,
    subject: `Appointment confirmed — ${booking.service_name} on ${formatDate(booking.date)}`,
    html: baseTemplate(body),
  })
  if (error) throw new Error(`Resend error: ${error.message}`)
}

export async function sendAdminNewBooking(booking: BookingDetails) {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) return

  const body = `
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:300;color:#c9a96e;">New Booking</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#a09080;">A new appointment request has been received.</p>
    ${detailsTable([
      { label: 'Client', value: booking.name },
      { label: 'Email', value: booking.email },
      { label: 'Phone', value: booking.phone },
      { label: 'Service', value: booking.service_name },
      { label: 'Date', value: formatDate(booking.date) },
      { label: 'Time', value: formatTime(booking.time_slot) },
      { label: 'Duration', value: `${booking.duration_minutes} minutes` },
      ...(booking.notes ? [{ label: 'Notes', value: booking.notes }] : []),
    ])}
    <p style="margin:24px 0 0;font-size:13px;color:#6a5f52;">Log in to the admin panel to confirm or cancel this booking.</p>`

  const { error } = await resend.emails.send({
    from: FROM,
    to: adminEmail,
    subject: `New booking: ${booking.name} — ${booking.service_name} on ${formatDate(booking.date)}`,
    html: baseTemplate(body),
  })
  if (error) throw new Error(`Resend error: ${error.message}`)
}
