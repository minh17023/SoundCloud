import { verifyTokenUtil } from '../utils/jwt.js';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const decoded = verifyTokenUtil(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token.' });
  }

  req.user = decoded;
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Requires ADMIN role.' });
  }
};
