import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export const sendVerificationEmail = async (toEmail, token) => {
  // If no email configured, log it and return (useful for dev if no env vars are set)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️ No EMAIL_USER or EMAIL_PASS environment variables set. Email verification will not work!')
    console.warn(`Attempting to send verification link to ${toEmail}: /verify-email/${token}`)
    return
  }

  const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${token}`

  const mailOptions = {
    from: `"AgriMarket Team" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Action Required: Verify your AgriMarket Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #10b981; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to AgriMarket! 🌱</h1>
        </div>
        <div style="padding: 32px 24px; background-color: #ffffff;">
          <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">Hello,</p>
          <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">Thanks for signing up! To get started and unlock all features, please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${verifyUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Verify My Email</a>
          </div>
          <p style="font-size: 14px; color: #6b7280; line-height: 1.5;">If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="font-size: 14px; color: #3b82f6; word-break: break-all;">${verifyUrl}</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">If you didn't create an account with AgriMarket, please ignore this email.</p>
        </div>
      </div>
    `
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Verification email sent: %s', info.messageId)
    return info
  } catch (error) {
    console.error('Error sending verification email:', error)
    throw new Error('Failed to send verification email. Please try again later.')
  }
}
