
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/users');
const createError = require('../utils/appError');

// REGISTER USER
exports.signup = async (req, res, next) => {
  try {
    // Vérification si l'utilisateur existe déjà
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return next(new createError('User already exists!', 400));
    }

    // Vérification du rôle
    const validRoles = ['admin', 'gestionnaire', 'technicien']; // Définir les rôles autorisés
    if (!validRoles.includes(req.body.role)) {
      return next(new createError('Invalid role. Role must be one of admin, gestionnaire, or technicien.', 400));
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    // Assignation du JWT
    const token = jwt.sign({ _id: newUser._id }, 'secretkey123', { expiresIn: '300d' });

    res.status(201).json({
      status: 'success',
      token,
      message: 'User registered successfully',
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
  
      const user = await User.findOne({ email });
  
      if (!user) return next(new createError('User not found!', 404));
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return next(new createError('Invalid email or password', 401));
      }
      const token = jwt.sign({ id: user._id }, 'secretkey123', {
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
            role : user.role,
        },
      });

    } catch (error) {
        next(error);
    }
  };