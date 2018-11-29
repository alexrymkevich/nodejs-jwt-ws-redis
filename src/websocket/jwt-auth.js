/* eslint-disable no-param-reassign */
const jwt = require('jsonwebtoken');

const defaultOptions = {
  algorithm: 'HS256',
  succeedWithoutToken: false,
};

function authenticate(options, verify) {
  const that = this;
  this.options = { ...defaultOptions, ...options };
  if (!this.options.secret) {
    throw new TypeError('SocketioJwtAuth requires a secret');
  }

  this.verify = verify;
  if (!this.verify) {
    throw new TypeError('SocketioJwtAuth requires a verify callback');
  }

  this.success = function (next) {
    next();
  };

  this.fail = function (err, next) {
    next(new Error(err));
  };

  return function (socket, next) {
    const token = socket.handshake.query.auth_token;
    const verified = function (err, user, message) {
      if (err) {
        return that.fail(err, next);
      } else if (!user) {
        if (!that.options.succeedWithoutToken) return that.fail(message, next);
        socket.request.user = { logged_in: false };
        return that.success(next);
      }
      user.logged_in = true;
      socket.request.user = user;
      return that.success(next);
    };
    try {
      let payload = {};
      if (!token) {
        if (!that.options.succeedWithoutToken) {
          return that.fail('No auth token', next);
        }
      } else {
        payload = jwt.verify(token, that.options.secret, that.options.algorithm);
      }
      that.verify({ ...payload, token }, verified);
    } catch (ex) {
      that.fail(ex, next);
    }
    return this;
  };
}

exports.authenticate = authenticate;
