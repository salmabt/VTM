const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Technicien = require('../models/Technicien');
const PendingUser = require('../models/pendingUsers'); // Correction ici
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
    const { name, email, password, role } = req.body;

    // Vérifier si l'utilisateur existe déjà dans PendingUser
    const existingPendingUser = await PendingUser.findOne({ email });
    if (existingPendingUser) {
      // Si l'utilisateur existe déjà dans PendingUser, le supprimer
      await PendingUser.deleteOne({ email });
      return res.status(400).json({
        status: 'error',
        message: 'User with this email already exists in pending approval!',
      });
    }

    // Vérification du rôle
    const validRoles = ['technicien'];
    if (!validRoles.includes(role)) {
      return next(new createError('Invalid role. Role must be just technicien.', 400));
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer un nouvel utilisateur dans PendingUser
    const newUser = await PendingUser.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Envoyer un e-mail à l'administrateur pour validation
    const adminMailOptions = {
      from: process.env.GMAIL_USER,
      to: 'salmatekaya86@gmail.com', // Remplacez par l'adresse e-mail de l'administrateur
      subject: 'Nouvelle inscription en attente',
      html: `
        <p>Un nouvel utilisateur s'est inscrit :</p>
        <ul>
          <li>Email: ${newUser.email}</li>
          <li>Nom: ${newUser.name}</li>
          <li>Rôle: ${newUser.role}</li>
        </ul>
        <p>Veuillez approuver l'inscription :</p>
        <a href="http://localhost:3000/api/auth/validate/${newUser._id}">Valider</a>
      `,
    };

    // Envoi de l'e-mail à l'administrateur
    try {
      await transporter.sendMail(adminMailOptions);
      console.log('E-mail envoyé à l\'administrateur avec succès.');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail à l\'administrateur :', error);
      return next(new createError('Failed to send email to admin.', 500));
    }

    // Réponse réussie
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully. Waiting for admin approval.',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
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

    // Vérification de l'existence de l'utilisateur
    const user = await User.findOne({ email });

    if (!user) return next(new createError('User not found!', 404));

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return next(new createError('Invalid email or password', 401));
    }

    // Vérification si l'utilisateur est approuvé
    if (!user.isApproved) {
      return next(new createError('Your account is pending approval by the admin.', 403));
    }

    const token = jwt.sign({ id: user._id }, jwtSecret, {
      expiresIn: '300d',
    });

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

// Route pour que l'administrateur valide l'utilisateur
// Route pour que l'administrateur valide l'utilisateur
exports.validateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Extract technician details from the request body
    const { phone, skills, availability } = req.body;

    // Validate that the required technician fields are provided
    if (!phone || !skills || !availability) {
      return next(new createError('Technician details (phone, skills, and availability) are required!', 400));
    }

    const pendingUser = await PendingUser.findById(userId);
    if (!pendingUser) {
      return next(new createError('Pending user not found!', 404));
    }

    // Création de l'utilisateur validé
    const approvedUser = await User.create({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
      role: pendingUser.role,
      isApproved: true,
    });

    // Création du profil technicien avec les informations supplémentaires
    const newTechnicien = await Technicien.create({
      user: approvedUser._id, // Liaison avec l'utilisateur
      email: approvedUser.email, // Copie de l'email
      name: approvedUser.name, // Copie du nom
      phone, // Ajout du téléphone
      skills, // Ajout des compétences
      availability, // Ajout de la disponibilité
    });

    // Suppression de l'utilisateur en attente
    await PendingUser.findByIdAndDelete(userId);

    // Mise à jour de l'e-mail de confirmation
    const userMailOptions = {
      from: process.env.GMAIL_USER,
      to: approvedUser.email,
      subject: 'Votre inscription a été approuvée',
      html: `<p>Félicitations ! Votre profil technicien est maintenant actif :</p>
             <p>Identifiant technicien : ${newTechnicien._id}</p>
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
      },
      technicien: {
        _id: newTechnicien._id,
        phone: newTechnicien.phone,
        skills: newTechnicien.skills,
        availability: newTechnicien.availability,
      },
    });
  } catch (error) {
    next(error);
  }
};
