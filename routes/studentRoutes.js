const express = require('express');
const { addStudent, getStudents, studentLogin } = require('../controllers/studentController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();
// console.log({ addStudent, getStudents, verifyToken });

router.post('/addStudent', verifyToken, addStudent);
router.get('/students', verifyToken, getStudents);
router.post('/studentLogin' ,studentLogin);

module.exports = router;