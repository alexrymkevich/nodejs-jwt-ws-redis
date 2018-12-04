/* eslint-disable no-param-reassign */
import http from 'http';
import io from 'socket.io';
import each from 'lodash/each';
import uuid from 'uuid';
import log4js from 'log4js';

import jwtAuth from './jwt-auth';
import storeService from './services/store.service';


require('dotenv').config();

log4js.configure({
  appenders: { websocket: { type: 'file', filename: './logs/websocket.log' } },
  categories: { default: { appenders: ['websocket'], level: 'debug' } },
});
const logger = log4js.getLogger('websocket');

const express = require('express');

const app = express();
const server = http.Server(app);
const socketio = io(server);
const userSockets = {};

const secret = process.env.JWT_SECRET || 'secret';
const algorithm = process.env.JWT_ALGORITHM || 'HS256';

// using middleware
socketio.use(jwtAuth.authenticate({
  secret, // required, used to verify the token's signature
  algorithm, // optional, default to be HS256
}, (payload, done) => {
  storeService().get(payload.token).then((userJson) => {
    const user = JSON.parse(userJson);
    if (!user) {
      // return fail with an error message
      return done(null, false, 'user does not exist');
    }
    // return success with a user info
    return done(null, user);
  }).catch((err) => done(err));
}));

server.listen(process.env.WS_PORT, () => {
  logger.debug('WS is listening on *:3010');
});

socketio.on('connection', (userSocket) => {
  userSocket.suid = uuid();
  userSocket.channels = userSocket.request.user.channels;
  logger.debug(userSocket.request.user);
  logger.info(`user ${userSocket.suid} connected`);
  userSockets[userSocket.suid] = userSocket;

  userSocket.emit('success', {
    message: 'success logged in!',
    channels: userSocket.request.user.channels,
  });

  userSocket.on('disconnect', () => {
    delete userSockets[userSocket.suid];
    console.debug(`user ${userSocket.suid} was disconnected`);
  });

  userSocket.on('command', function (command, res) {
    const { type, data } = command;
    logger.info(command);
    const success = true;
    switch (type) {
      case 'ADD_CHANNEL':
        this.channels = [...this.channels, data];
        break;
      case 'REMOVE_CHANNEL':
        this.channels = this.channels.filter((it) => it !== data);
        break;
      default:
        break;
    }
    if (success) {
      res({ success: true, msg: 'Success.' });
    } else {
      res({ success: false, msg: 'Something went wrong.' });
    }
  });
});

socketio.on('error', (err) => {
  throw new Error(err);
});

setInterval(() => {
  each(userSockets, (socket) => {
    if (socket.channels && socket.channels.includes('info')) {
      socket.emit('info', {
        data: `info - ${Math.random()}`,
      });
    }
    if (socket.channels && socket.channels.includes('channel1')) {
      socket.emit('data', {
        data: `channel 1 - ${Math.random()}`,
      });
    }
    if (socket.channels && socket.channels.includes('channel2')) {
      socket.emit('data', {
        data: `channel 2 - ${Math.random()}`,
      });
    }
  });
}, 1000);
