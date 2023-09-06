const jwt = require('jsonwebtoken');
const AuthErr = require('../errors/AuthErr');
const config = require('../config');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthErr('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, config.JWT_SECRET);
    req.user = payload;
  } catch (err) {
    return next(new AuthErr('Необходима авторизация'));
  }

  return next();
};
