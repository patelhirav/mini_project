const db = require('../db/db');

module.exports = {
    async addStudent(req, res) {
        const { name, email, password, class: studentClass } = req.body;
        const userId = req.user?.userId;

        console.log('Add Student Body:', req.body);
        console.log('User ID:', userId);

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        if (!name || !email || !password || !studentClass) {
            return res.status(400).json({ message: 'All fields (name, email, password, class) are required' });
        }
        
        const query = 'INSERT INTO students (name, email, password, class, user_id) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [name, email, password, studentClass, userId], (err, results) => {
            if (err) {
                console.error('Error adding student:', err);
                return res.status(500).json({ message: 'Failed to add student' });
            }

            res.status(200).json({ message: 'Student added successfully' });
        });
    },

    async getStudents(req, res) {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const query = 'SELECT name, email, password, class FROM students WHERE user_id = ?';
        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error fetching students:', err);
                return res.status(500).json({ message: 'Failed to fetch students' });
            }
            res.status(200).json(results);
        });
    },

    async studentLogin(req, res) {
        const { email, password } = req.body;
        console.log('Student Login: ',req.body);

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }

        const sql = 'SELECT * FROM students WHERE email = ?';
        db.query(sql, [email], async (err, results) => {
            if (err) {
                console.error('Error', err);
                return res.status(500).json({ message: 'Server Error' });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'Student not found' });
            }

            const token = jwt.sign(
                { studentId: student.id, class: student.class },
                SECRET_KEY,
                { expiresIn: '1h' }
            );
            console.log(token);
            res.status(200).json({ message: 'Login successfull', token });
        });
    },
};
