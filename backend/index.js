//index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRouter = require('./routes/authRoute');
const taskRouter = require('./routes/tasksRoutes');
const voitureRouter = require('./routes/voitureRoutes');
const technicienRouter = require('./routes/technicienRoutes'); // Ajouté
const notesRouter = require('./routes/notesRoute'); 
const gestionnairesRoutes = require('./routes/gestionnaireRoute');
const { upload } = require('./config/multer');
const reportRoutes = require('./routes/reportRoutes');
const path = require('path'); 
const app = express();


// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
// Base de données
connectDB();

// Routes
app.use('/api/auth', authRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/vehicules', voitureRouter);
app.use('/api/techniciens', technicienRouter); 
app.use('/api/notes', notesRouter);
app.use('/api/gestionnaires', gestionnairesRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/reports', reportRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  res.status(statusCode).json({
    status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});