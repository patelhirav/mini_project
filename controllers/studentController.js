const db = require('../db/db');
const bcrypt = require('bcryptjs');

module.exports = {

    async addStudent(req, res) {
        const { name, email, class: studentClass } = req.body;

        const userId = req.user.userId;

        if (!name || !email || !studentClass) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const query = 'INSERT INTO students (name, email, class, user_id) VALUES (?, ?, ?, ?)';
        const values = [name, email, studentClass, userId];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Error:', err);
                return res.status(500).json({ message: 'Failed to add student' });
            }
            res.status(201).json({ message: 'Student added successfully', studentId: result.insertId });
        });
    },
    async getStudents(req, res) {
        const query = 'SELECT name, email, class FROM students';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error:', err);
                return res.status(500).json({ message: 'Failed to fetch students' });
            }
            res.status(200).json(results);
        });
    },
}