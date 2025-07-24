const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { userId, role }

    // Attach barangay for worker
    if (req.user.role === 'worker') {
      const User = require('../models/User');
      User.findById(req.user.userId).select('barangay').then(userDoc => {
        if (userDoc && userDoc.barangay) {
          req.user.barangay = userDoc.barangay;
        }
        next();
      }).catch(() => next());
    } else {
      next();
    }
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};