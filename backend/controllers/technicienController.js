const mongoose = require('mongoose');
const Technicien = require('../models/users');
const createError = require('../utils/appError');

exports.createTechnicien = async (req, res, next) => {
  try {
    const { name, email, password, phone, skills } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await Technicien.findOne({ email });
    if (existingUser) {
      return next(new createError('Un utilisateur avec cet email existe déjà.', 400));
    }

    // Créer un nouvel utilisateur avec le rôle "technicien"
    const newTechnicien = await Technicien.create({
      name,
      email,
      password,
      phone,
      skills,
      role: 'technicien' // Assurez-vous que le rôle est défini
    });

    res.status(201).json({
      status: 'success',
      data: {
        technicien: newTechnicien
      }
    });
  } catch (error) {
    console.error('Erreur création technicien:', error);
    next(new createError(`Erreur de création: ${error.message}`, 400));
  }
};