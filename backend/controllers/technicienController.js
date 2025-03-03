//backend/techniciencontroller
const mongoose = require('mongoose');
const Technicien = require('../models/users');
const createError = require('../utils/appError');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');


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
exports.loginTechnicien = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const technicien = await Technicien.findOne({ email });
    if (!technicien) {
      return next(createError(401, 'Email ou mot de passe incorrect.'));
    }

    // Comparer le mot de passe fourni avec celui haché dans la base de données
    const isMatch = await bcrypt.compare(password, technicien.password);
    if (!isMatch) {
      return next(createError(401, 'Email ou mot de passe incorrect.'));
    }

    // Créer un JWT avec un secret et une expiration de 1 heure
    const token = jwt.sign(
      { id: technicien._id, role: technicien.role },
      process.env.JWT_SECRET || 'ton_secret_key', // Assure-toi que tu as une clé secrète dans ton .env
      { expiresIn: '1h' }
    );

    // Retourner le token dans la réponse
    res.status(200).json({
      status: 'success',
      token, // Envoyer le token pour que le client l'utilise pour les requêtes suivantes
      data: {
        technicien: {
          id: technicien._id,
          name: technicien.name,
          email: technicien.email,
          role: technicien.role
        }
      }
    });
  } catch (error) {
    next(createError(500, error.message));
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


exports.updateTechnicien = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, password, phone, skills, archived } = req.body;

    // Si un mot de passe est fourni, il faut le hacher
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12); // Hachage du mot de passe
      req.body.password = hashedPassword; // Remplace le mot de passe dans le body avec le haché
    }

    // Mise à jour du technicien avec les données reçues
    const updatedTechnicien = await Technicien.findByIdAndUpdate(
      id,
      req.body,  // Ici, req.body contient tous les champs, y compris le mot de passe haché
      { new: true, runValidators: true }
    );
    if (!updatedTechnicien) {
      return next(createError(404, 'Technicien non trouvé'));
    }

    res.status(200).json({
      status: 'success',
      data: updatedTechnicien
    });
  } catch (error) {
    next(createError(500, error.message));
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

// Dans backend/controllers/technicienController.js
exports.archiveTechnicien = async (req, res) => {
  try {
    const { id } = req.params;
    
    const archivedTechnicien = await Technicien.findByIdAndUpdate(
      id,
      { archived: true },
      { new: true ,runValidators: true} // Retourne le document modifié
    );

    res.status(200).json({
      status: 'success',
      data: archivedTechnicien // Structure de réponse standardisée
    });
    
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
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