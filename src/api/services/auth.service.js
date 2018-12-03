const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'secret';
const algorithm = process.env.JWT_ALGORITHM || 'secret';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || 10800;
const jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || 10800;

const authService = () => {
  const createToken = (payload) => ({
    token: jwt.sign(payload, secret, { expiresIn: jwtExpiresIn, algorithm }),
    refreshToken: jwt.sign(payload, secret, { expiresIn: jwtRefreshExpiresIn, algorithm }),
    expiresIn: +new Date() + (+jwtExpiresIn),
  });
  const verifyToken = (token, cb) => jwt.verify(token, secret, algorithm, cb);

  return {
    createToken,
    verifyToken,
  };
};

module.exports = authService;
