const jwt = require('jsonwebtoken');

const secret = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'secret';

const authService = () => {
  const createToken = (payload) => jwt.sign(payload, secret, { expiresIn: 10800 });
  const verifyToken = (token, cb) => jwt.verify(token, secret, {}, cb);

  return {
    createToken,
    verifyToken,
  };
};

module.exports = authService;
