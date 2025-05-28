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
    const phoneRegex = /^\+216\d{8}$/;
    if (!phoneRegex.test(phone)) {
      return next(createError(400, "Format téléphone invalide (+21612345678)"));
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return next(createError(400, 
        "Le mot de passe doit contenir : 8 caractères minimum, 1 majuscule, 1 minuscule et 1 caractère spécial (@$!%*?&)"
      ));
    }
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
        phone: newUser.phone, // Ajout du téléphone
        password: newUser.password 
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
    const { email, phone, password } = req.body;

    // Validation obligatoire
    if (!email?.trim()) return next(createError(400, "L'email est obligatoire"));
    if (!phone?.trim()) return next(createError(400, "Le téléphone est obligatoire"));
    if (!password?.trim()) return next(createError(400, "Le mot de passe est obligatoire"));

    // Validation format email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return next(createError(400, "Format email invalide"));
    }

    // Validation téléphone
    if (!/^\+216\d{8}$/.test(phone)) {
      return next(createError(400, "Format téléphone invalide (+216xxxxxxxx)"));
    }

    // Validation mot de passe
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return next(createError(400, "Le mot de passe doit contenir 8 caractères avec majuscule, minuscule et caractère spécial"));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Mise à jour
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        email,
        phone,
        password: hashedPassword
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return next(createError(404, 'Gestionnaire non trouvé'));

    res.status(200).json(updatedUser);
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
// GET /api/gestionnaires/count
exports.countGestionnaires = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { role: "gestionnaire" };

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const totalGestionnaires = await User.countDocuments(filter);
    res.status(200).json({ totalGestionnaires });
  } catch (error) {
    next(error);
  }
};

  