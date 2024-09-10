import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  const { email, address, privateKey, amount, token } = await request.json()

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'darshitbhalodi@gmail.com',
      pass: 'owhyhgseaczjhjhs' // Use an app-specific password for security
    }
  })

  const mailOptions = {
    from: 'darshitbhalodi@gmail.com',
    to: email,
    subject: 'Token Transfer Confirmation',
    html: `
      <h1>Token Transfer Confirmation</h1>
      <p>Your token transfer has been completed successfully.</p>
      <h2>Transaction Details:</h2>
      <ul>
        <li><strong>Amount:</strong> ${amount} ${token}</li>
        <li><strong>Receiver Address:</strong> ${address}</li>
        <li><strong>Private Key:</strong> ${privateKey}</li>
      </ul>
      <p>Please keep this information secure and do not share it with anyone.</p>
    `
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:', info.messageId)
    return NextResponse.json({ message: 'Email sent successfully' })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json({ message: 'Error sending email' }, { status: 500 })
  }
}