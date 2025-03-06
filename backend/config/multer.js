//config/multer.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Renommer le fichier
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });


module.exports = { upload };