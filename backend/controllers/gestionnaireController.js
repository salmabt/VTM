// controllers/gestionnaireController.js
const User = require('../models/users');
const createError = require('../utils/appError');

exports.createGestionnaire = async (req, res, next) => {
  try {
    // 1. Vérifier si la personne est un admin
    //    -> Soit vous avez un middleware, soit vous faites la vérification ici
    // const adminUser = await User.findById(req.user.id);
    // if (!adminUser || adminUser.role !== 'admin') {
    //   return next(new createError('You must be admin to create a gestionnaire', 403));
    // }

    // 2. Récupérer les champs du body
    const { name, email, password, role, phone } = req.body;

    // 3. Créer l'utilisateur dans la collection "users" avec le rôle gestionnaire
    const newUser = await User.create({
      name,
      email,
      password, // sera haché si vous utilisez un pre('save') dans le schéma
      role: role || 'gestionnaire',
      phone,    // si vous le gérez
      isApproved: true,
    });

    // 4. Répondre avec un code 201 + infos
    return res.status(201).json({
      status: 'success',
      data: {
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
  