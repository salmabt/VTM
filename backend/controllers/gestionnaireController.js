// controllers/gestionnaireController.js
const User = require('../models/users');
const createError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.loginGestionnaire = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'email et le mot de passe sont fournis
    if (!email || !password) {
      return next(createError(400, 'Email et mot de passe requis'));
    }

    // Vérifier si l'utilisateur existe et a le rôle gestionnaire
    const gestionnaire = await User.findOne({ email, role: 'gestionnaire' });

    if (!gestionnaire) {
      return next(createError(401, 'Email ou mot de passe incorrect'));
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, gestionnaire.password);
    if (!isMatch) {
      return next(createError(401, 'Email ou mot de passe incorrect'));
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: gestionnaire._id, role: gestionnaire.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Envoyer la réponse avec le token
    res.status(200).json({
      status: 'success',
      token,
      data: {
        _id: gestionnaire._id,
        name: gestionnaire.name,
        email: gestionnaire.email,
        role: gestionnaire.role
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.createGestionnaire = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Vérifier les champs obligatoires
    if (!name || !email || !password) {
      return next(createError(400, 'Tous les champs sont obligatoires'));
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role: 'gestionnaire',
      phone,
      isApproved: true,
    });

    res.status(201).json({
      status: 'success',
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      }
    });
  } catch (error) {
    // Gestion des erreurs spécifiques
    let errMsg = 'Erreur serveur';
    if (error.code === 11000) {
      errMsg = 'Cet email est déjà utilisé';
    } else if (error.name === 'ValidationError') {
      errMsg = error.message;
    }
    next(createError(400, errMsg));
  }
};

exports.getAllGestionnaires = async (req, res, next) => {
    try {
      const gestionnaires = await User.find({ role: "gestionnaire" });
  
      return res.status(200).json({
        status: "success",
        data: gestionnaires, // 👈 Assure-toi que c'est un tableau
      });
    } catch (error) {
      next(error);
    }
  };

// Mettre à jour un gestionnaire
exports.updateGestionnaire = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone ,archived } = req.body; // Ne pas inclure le mot de passe ici

    // Vérifier les champs obligatoires
    if (!name || !email) {
      return next(createError(400, 'Nom et email sont obligatoires'));
    }

    // Mise à jour sélective
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, phone ,archived },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return next(createError(404, 'Gestionnaire non trouvé'));

    res.status(200).json({
      status: 'success',
      data: updatedUser
    });
  } catch (error) {
    next(createError(400, error.message));
  }
};

// Archiver un gestionnaire 

exports.archiveGestionnaire = async (req, res, next) => {
  try {
    const { id } = req.params;

    const archivedUser = await User.findByIdAndUpdate(
      id,
      { archived: true },
      { new: true }
    );

    if (!archivedUser) return next(createError(404, 'Gestionnaire non trouvé'));

    res.status(200).json(archivedUser); // Retourner directement l'objet
  } catch (error) {
    next(error);
  }
};
exports.getArchivedGestionnaires = async (req, res, next) => {
  try {
    const gestionnaires = await User.find({ 
      role: "gestionnaire",
      archived: true
    });

    res.status(200).json(gestionnaires); // Envoyer directement le tableau
  } catch (error) {
    next(error);
  }
};
// Restaurer un gestionnaire (mettre isApproved à true)
exports.restoreGestionnaire = async (req, res, next) => {
  try {
    const { id } = req.params;

    const restoredUser = await User.findByIdAndUpdate(
      id,
      { archived: false }, // 👈 Utiliser le champ dédié
      { new: true }
    );

    if (!restoredUser) return next(createError(404, 'Gestionnaire non trouvé'));

    res.status(200).json({
      status: 'success',
      data: restoredUser
    });
  } catch (error) {
    next(error);
  }
};

// Supprimer un gestionnaire
exports.deleteGestionnaire = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Trouver et supprimer le gestionnaire
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return next(createError(404, 'Gestionnaire non trouvé'));
    }

    return res.status(204).json({
      status: 'success',
      message: 'Gestionnaire supprimé',
    });
  } catch (error) {
    next(error);
  }
};

  