require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const User = require('../models/users');

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch(err => {
    console.error('❌ Erreur MongoDB:', err.message);
    process.exit(1);
  });

const setAdminPassword = async (isNew = false) => {
  return new Promise((resolve) => {
    readline.question(`Entrez le mot de passe ${isNew ? 'NOUVEAU' : ''} pour l'admin: `, async (password) => {
      resolve(await bcrypt.hash(password, 12));
      readline.close();
    });
  });
};

const setupAdmin = async () => {
  try {
    // 1. Vérifier si l'admin existe
    const admin = await User.findOne({ 
      email: process.env.ADMIN_EMAIL || "salmatekaya86@gmail.com",
      role: "admin" 
    });

    // 2. Logique de création/mise à jour
    if (admin) {
      console.log('⚠️ Admin existe déjà');
      const update = await new Promise((resolve) => {
        readline.question('Voulez-vous changer le mot de passe ? (o/n) ', resolve);
      });

      if (update.toLowerCase() === 'o') {
        const hashedPass = await setAdminPassword(true);
        admin.password = hashedPass;
        await admin.save();
        console.log('🔑 Mot de passe admin mis à jour !');
      }
    } else {
      const hashedPass = await setAdminPassword();
      await User.create({
        name: "Admin System",
        email: process.env.ADMIN_EMAIL || "salmatekaya86@gmail.com",
        password: hashedPass,
        role: "admin",
        isApproved: true
      });
      console.log('🎉 Admin créé avec succès !');
    }

    process.exit(0);

  } catch (error) {
    console.error('🔥 Erreur critique:', error.message);
    process.exit(1);
  }
};

setupAdmin();