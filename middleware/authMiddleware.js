// const jwt = require('jsonwebtoken');
// const SECRET_KEY = 'fhjkb';
// const mysql = require('mysql');
// const db = require('../db/db');


// module.exports = {
//   async verifyToken(req, res) {
//     console.log(req.body);

//     const { email, password } = req.body;

//     const tbl = 'SELECT * FROM users WHERE email = ?';
//     db.query(tbl, [email], async (err, results) => {
//       if (err) return res.status(500).json({ message: 'Server error' });

//       if (results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
//         return res.status(401).json({ message: 'Invalid email or password' });
//       }

//       const user = results[0];

//       const token = jwt.sign(
//         { userId: user.id, name: user.name },
//         process.env.JWT_SECRET,
//         { expiresIn: '1h' }
//       );

//       res.status(200).json({ token, name: user.name });
//     });
//   }
// };

const jwt = require('jsonwebtoken');
const SECRET_KEY = 'fhjkb';

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = decoded;
    next();
  });
};

