const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your-secret-key';

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('No token, authorization denied');

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).send('Token is not valid');
    console.log(e);
  }
};

module.exports = auth;