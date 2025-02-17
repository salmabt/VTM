const Technicien = require('../models/Technicien');
const createError = require('../utils/appError');

exports.createTechnicien = async (req, res, next) => {
  try {
    // Vérification de l'existence de l'utilisateur
    const userExists = await mongoose.model('User').exists({ 
      _id: req.body.user,
      role: 'technicien' 
    });

    if (!userExists) {
      return next(new createError('Utilisateur technicien introuvable', 404));
    }

    const newTechnicien = await Technicien.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        technicien: await Technicien.findById(newTechnicien._id)
          .populate('user')
      }
    });

  } catch (error) {
    next(new createError(`Erreur de création: ${error.message}`, 400));
  }
};