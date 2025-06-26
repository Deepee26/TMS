const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { route } = require('./authRoutes');

router.get('/dashboard', userController.getDashboard);
router.get('/foods', userController.getAllFoods);

module.exports = router;
