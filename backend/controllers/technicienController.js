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


exports.archiveTechnicien = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mettre à jour le technicien pour le marquer comme archivé
    const archivedTechnicien = await Technicien.findByIdAndUpdate(id, { archived: true }, { new: true });

    if (!archivedTechnicien) {
      return res.status(404).json({ message: "Technicien non trouvé" });
    }

    res.json(archivedTechnicien);
  } catch (error) {
    console.error("Erreur lors de l'archivage :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};