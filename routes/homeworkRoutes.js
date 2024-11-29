const express = require('express');
const { addHomework, getHomework } = require('../controllers/homeworkController');
const { verifyToken } = require('../middleware/authMiddleware');

const   router = express.Router();
// console.log(addHomework, getHomework, verifyToken);    
router.post('/addHomework', verifyToken, addHomework);
router.get('/homework', verifyToken, getHomework);

module.exports = router;