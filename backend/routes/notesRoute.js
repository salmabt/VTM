const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notescontroller');

// Routes pour les notes
router.post('/', notesController.createNote);
router.get('/', notesController.getAllNotes);
router.put('/:id', notesController.updateNote);
router.delete('/:id', notesController.deleteNote);



module.exports = router;