const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'secret';
const algorithm = process.env.JWT_ALGORITHM || 'secret';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || 10800;

const authService = () => {
  const createToken = (payload) =>
    jwt.sign(payload, secret, { expiresIn: jwtExpiresIn, algorithm });
  const verifyToken = (token, cb) => jwt.verify(token, secret, algorithm, cb);

  return {
    createToken,
    verifyToken,
  };
};

module.exports = authService;
