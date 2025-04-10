const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter using your Gmail account
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'wcff.feedback@gmail.com',
    pass: process.env.email_app_pass // Using environment variable for security
  }
});


async function sendMail(options) {
  // Setup mail options
  const mailOptions = {
    from: 'wcff.feedback@gmail.com',
    to: 'rockyraghav45@gmail.com',
    subject: `USER FEEDBACK: ${options.subject}`,
    replyTo: options.email, // So you can reply directly to the sender
    text: `
Name: ${options.name}
Email: ${options.email}
Subject: ${options.subject}

Message:
${options.message}
    `,
    html: `
      <h3>Contact-Us Form Submission</h3>
      <p><strong>Name:</strong> ${options.name}</p>
      <p><strong>Email:</strong> ${options.email}</p>
      <p><strong>Subject:</strong> ${options.subject}</p>
      <p><strong>Message:</strong></p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
        ${options.message.replace(/\n/g, '<br>')}
      </div>
    `
  };

  // Return a promise for better error handling
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email sending error:', error);
        reject(error);
      } else {
        console.log('Email sent successfully:', info.response);
        resolve(info);
      }
    });
  });
}
exports.sendMail = sendMail;