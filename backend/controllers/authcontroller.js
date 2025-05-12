//backend/authcontroller
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const PendingUser = require('../models/pendingUsers');
const createError = require('../utils/appError');
const nodemailer = require('nodemailer');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET || 'defaultSecretKey';

// Configuration du transporteur SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// REGISTER USER
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, skills, location} = req.body;

    // Vérifier si l'utilisateur existe déjà dans PendingUser
    const existingPendingUser = await PendingUser.findOne({ email });
    if (existingPendingUser) {
      await PendingUser.deleteOne({ email });
      return res.status(400).json({
        status: 'error',
        message: 'User with this email already exists in pending approval!',
      });
    }

    // Vérification du rôle
    if (role !== 'technicien') {
      return next(new createError('Invalid role. Role must be "technicien".', 400));
    }

    // Vérification du téléphone
  // Remplacer la validation existante du téléphone
if (!phone || !/^\d{8}$/.test(phone)) {
  return next(new createError('Format de téléphone invalide (8 chiffres requis)', 400));
}

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log("Mot de passe original:", password);
    console.log("Mot de passe haché:", hashedPassword);


    // Créer un nouvel utilisateur dans PendingUser
    const newUser = await PendingUser.create({ name, email, password: hashedPassword, role, phone, skills, location,  isApproved: false });

    // Envoyer un e-mail à l'administrateur pour validation
    const adminMailOptions = {
      from: process.env.GMAIL_USER,
      to: 'salmatekaya86@gmail.com',
      subject: 'Nouvelle inscription en attente',
      html: `
        <p>Un nouvel technicien s'est inscrit :</p>
        <ul>
          <li>Nom Et Prénom: ${newUser.name}</li>
          <li>Email: ${newUser.email}</li>
          <li>Phone: ${newUser.phone}</li>
          <li>skills: ${newUser.skills}</li>
          <li>Gouvernorat: ${newUser.location}</li>
        </ul>
        <p>Veuillez approuver l'inscription :</p>
        <a href="http://localhost:3000/api/auth/validate/${newUser._id}">Valider</a>
      `,
    };

    try {
      await transporter.sendMail(adminMailOptions);
      console.log('E-mail envoyé à l\'administrateur avec succès.');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail à l\'administrateur :', error);
      return next(new createError('Failed to send email to admin.', 500));
    }

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully. Waiting for admin approval.',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        skills: newUser.skills,
        location: newUser.location,
      },
    });
  } catch (error) {
    next(error);
  }
};

// LOGGING USER
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      console.log(`Tentative de connexion avec un e-mail inconnu : ${email}`);
      return next(new createError('User not found!', 404));
    }
    console.log("Mot de passe en clair saisi:", password);
console.log("Mot de passe stocké en base:", user.password);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Résultat de la comparaison:", isPasswordValid);
    if (!isPasswordValid) {
      console.log(`Tentative de connexion avec un mot de passe incorrect pour l'utilisateur : ${email}`);
      return next(new createError('Invalid email or password', 401));
    }

    if (!user.isApproved) {
      console.log(`Tentative de connexion avec un compte non approuvé : ${email}`);
      return next(new createError('Your account is pending approval by the admin.', 403));
    }

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' });
    console.log(`Connexion réussie pour l'utilisateur : ${email}`);
    res.status(200).json({
      status: 'success',
      token,
      message: 'Logged in successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// VALIDATION PAR L'ADMINISTRATEUR
exports.validateUser = async (req, res, next) => {
  try {
      const { userId } = req.params;

      // Récupérer l'utilisateur en attente
      const pendingUser = await PendingUser.findById(userId);
      if (!pendingUser) {
          return next(new createError('Pending user not found!', 404));
      }

      // Créer un utilisateur validé avec les données de PendingUser
      const approvedUser = await User.create({
          name: pendingUser.name,
          email: pendingUser.email,
          password: pendingUser.password,
          role: pendingUser.role,
          phone: pendingUser.phone, // Utiliser le téléphone de PendingUser
          skills: pendingUser.skills,
          location: pendingUser.location, // Utiliser les compétences de PendingUser
          isApproved: true,
      });

      // Supprimer l'utilisateur en attente
      await PendingUser.findByIdAndDelete(userId);

      // Envoyer un e-mail de confirmation
      const userMailOptions = {
          from: process.env.GMAIL_USER,
          to: approvedUser.email,
          subject: 'Votre inscription a été approuvée',
          html: `<p>Félicitations ! Votre profil technicien est maintenant actif.</p>
                 <p>Identifiant technicien : ${approvedUser._id}</p>
                 <a href="http://localhost:5173/login">Se connecter</a>`,
      };

      await transporter.sendMail(userMailOptions);

      res.status(200).json({
          status: 'success',
          message: 'User approved and technician profile created',
          user: {
              _id: approvedUser._id,
              name: approvedUser.name,
              email: approvedUser.email,
              phone: approvedUser.phone,
              skills: approvedUser.skills,
              location: approvedUser.location,
          },
      });
  } catch (error) {
      next(error);
  }
};