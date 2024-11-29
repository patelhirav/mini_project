const db = require('../db/db');

module.exports = {
    async addStudent(req, res) {
        const { name, email, class: studentClass } = req.body;
        const userId = req.user.userId;

        // console.log('Request Body:', req.body);
        // console.log('User ID:', userId);

        if (!name || !email || !studentClass) {
            return res.status(400).json({ message: 'All fields (name, email, class) are required' });
        }

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const query = 'INSERT INTO students (name, email, class, user_id) VALUES (?, ?, ?, ?)';
        db.query(query, [name, email, studentClass, userId], (err, results) => {
            if (err) {
                console.error('Error adding student:', err);
                return res.status(500).json({ message: 'Failed to add student' });
            }
            res.status(201).json({ message: 'Student added successfully' });
        });
    },

    async getStudents(req, res) {
        // console.log('Decoded user:', req.user);
        const userId = req.user?.userId;
        // console.log(userId);

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const query = 'SELECT name, email, class FROM students WHERE user_id = ?';
        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error fetching students:', err);
                return res.status(500).json({ message: 'Failed to fetch students' });
            }
            res.status(200).json(results);
        });
    },
}