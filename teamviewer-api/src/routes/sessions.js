const express = require('express');
const router = express.Router();
const sessionsController = require('../controllers/sessionsController');

router.get('/', sessionsController.getAllSessions);
router.get('/:id', sessionsController.getSessionById);
router.post('/', sessionsController.createSession);
router.patch('/:id', sessionsController.updateSession);
router.delete('/:id', sessionsController.deleteSession);

module.exports = router;
