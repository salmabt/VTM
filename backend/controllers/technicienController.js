//backend/techniciencontroller
const mongoose = require('mongoose');
const Technicien = require('../models/users');
const createError = require('../utils/appError');
const bcrypt = require('bcryptjs'); // Ajout de bcrypt pour hacher les mots de passe

exports.createTechnicien = async (req, res, next) => {
  try {
    const { name, email, password, phone, skills } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await Technicien.findOne({ email });
    if (existingUser) {
      return next(new createError('Un utilisateur avec cet email existe déjà.', 400));
    }

    // Validation des données (par exemple, si l'email et le mot de passe sont valides)
    if (!name || !email || !password) {
      return next(new createError('Nom, email et mot de passe sont obligatoires.', 400));
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 12); // Hachage avec un coût de 12

    // Créer un nouvel utilisateur avec le rôle "technicien"
    const newTechnicien = await Technicien.create({
      name,
      email,
      password: hashedPassword, // Utiliser le mot de passe haché
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
    next(new createError(`Erreur de création: ${error.message}`, 500)); // 500 pour erreur serveur
  }
};


exports.getAllTechniciens = async (req, res) => {
  try {
    const techniciens = await Technicien.find({ 
      role: 'technicien',
      archived: false // Ajout du filtre
    });
    res.json(techniciens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getArchivedTechniciens = async (req, res) => {
  try {
    const techniciens = await Technicien.find({ 
      role: 'technicien',
      archived: true // Ajout du filtre
    });
    res.json(techniciens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.archiveTechnicien = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier l'existence du technicien
    const tech = await Technicien.findById(id);
    if (!tech) return res.status(404).json({ message: "Technicien non trouvé" });

    // Archiver avec validation
    const archivedTechnicien = await Technicien.findByIdAndUpdate(
      id,
      { archived: true },
      { new: true, runValidators: true }
    );

    res.json({
      status: 'success',
      data: archivedTechnicien
    });
  } catch (error) {
    console.error("Erreur d'archivage :", error);
    res.status(500).json({ 
      status: 'error',
      message: 'Erreur serveur',
      error: error.message 
    });
  }
};

exports.restoreTechnicien = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier l'existence du technicien
    const tech = await Technicien.findById(id);
    if (!tech) return res.status(404).json({ message: "Technicien non trouvé" });

    // Restaurer avec validation
    const restoredTechnicien = await Technicien.findByIdAndUpdate(
      id,
      { archived: false },
      { new: true, runValidators: true }
    );

    res.json({
      status: 'success',
      data: restoredTechnicien
    });
  } catch (error) {
    console.error("Erreur de restauration :", error);
    res.status(500).json({ 
      status: 'error',
      message: 'Erreur serveur',
      error: error.message 
    });
  }
};