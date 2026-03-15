import nodemailer from 'nodemailer'

const sendEmail = async (options) => {
  let transporter

  // Try to use environment variables if available
  if (process.env.EMAIL_HOST && process.env.EMAIL_PORT && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  } else {
    // Fall back to Ethereal account if no configuration is provided
    console.log('No SMTP config found in .env, creating a test Ethereal account...')
    const testAccount = await nodemailer.createTestAccount()
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    })
  }

  const message = {
    from: `${process.env.FROM_NAME || 'Tailor-wala'} <${process.env.FROM_EMAIL || 'noreply@tailorwala.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  }

  const info = await transporter.sendMail(message)

  console.log('Message sent: %s', info.messageId)
  
  if (!process.env.EMAIL_HOST) {
    // If using Ethereal account, log the URL to preview the email
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
  }
}

export default sendEmail
