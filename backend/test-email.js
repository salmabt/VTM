const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const mailOptions = {
    from: process.env.GMAIL_USER,
    to: 'bhouriyosr50@gmail.com',
    subject: 'Confirmation d\'inscription',
    html: '<h1>Merci de vous être inscrit</h1><p>Veuillez confirmer votre adresse e-mail.</p>',
  };

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
  } else {
    console.log('E-mail envoyé avec succès :', info.response);
  }
}
);