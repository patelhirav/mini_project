const db = require('../db/db');

module.exports = {
    async addHomework(req, res) {
        const { title, class: homeworkClass, topic, subject } = req.body;
        const userId = req.user.userId;

        console.log('Request Body:', req.body);
        console.log('User ID:', userId);

        if (!title || !homeworkClass || !topic || !subject) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const query = 'INSERT INTO homework (title, class, topic, subject, user_id) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [title, homeworkClass, topic, subject, userId], (err, result) => {
            if (err) {
                console.error('Error inserting homework:', err);
                return res.status(500).json({
                    message: 'Failed to add homework',
                    error: err.sqlMessage || err.message,
                });
            }
            res.status(201).json({ message: 'Homework added successfully' });
        });
    },

    async getHomework(req, res) {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(400).json({ message: 'User ID required' });
        }

        const query = 'SELECT title, class, topic, subject FROM homework WHERE user_id = ?';

        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error fetching student: ', err);
                return res.status(500).json({ message: 'Failed to fetch student' });
            }
            res.status(200).json(results);
        });
    }
}