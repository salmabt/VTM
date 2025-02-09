require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Import the database connection function
const authRouter =require('./routes/authRoute');

// Create the Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to the database
connectDB();

// route
app.use('/api/auth', authRouter) ;

// global error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500; // Correction de la faute de frappe
    const status = err.status || 'error';
  
    if (statusCode === 500) {
      console.error(err); // Journalisation de l'erreur pour le débogage
    }
  
    res.status(statusCode).json({
      status: status,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }), // Inclure la stack trace en développement seulement
    });
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});