/* eslint-disable no-param-reassign */
import http from 'http';
import io from 'socket.io';
import each from 'lodash/each';
import jwtAuth from 'socketio-jwt-auth';
import uuid from 'uuid';

const express = require('express');

const app = express();
const server = http.Server(app);
const socketio = io(server);
const userSockets = {};


// using middleware
socketio.use(jwtAuth.authenticate({
  secret: 'secret', // required, used to verify the token's signature
  algorithm: 'HS256', // optional, default to be HS256
  succeedWithoutToken: true,
}, (payload, done) => {
  // done is a callback, you can use it as follows
  console.log(payload);
  const user = {
    username: 'alex',
    role: 'developer',
    password: 'alexpass',
  };
  if (payload && payload.username) {
    return done(null, user);
  } else {
    return done();
  }


  // User.findOne({id: payload.sub}, function(err, user) {
  //   if (err) {
  //     // return error
  //     return done(err);
  //   }
  //   if (!user) {
  //     // return fail with an error message
  //     return done(null, false, 'user does not exist');
  //   }
  //   // return success with a user info
  //   return done(null, user);
  // });
}));

server.listen(3010, () => {
  console.log('WS is listening on *:3010');
});

socketio.on('connection', (userSocket) => {
  console.log('a user connected');
  userSocket.suid = uuid();

  userSockets[userSocket.suid] = userSocket;

  userSocket.emit('success', {
    message: 'success logged in!',
    user: userSocket.request.user,
  });

  userSocket.on('disconnect', () => {
    delete userSockets[userSocket.suid];
    console.log(`user ${userSocket.suid} was disconnected`);
  });
});

socketio.on('error', (err) => {
  throw new Error(err);
});

setInterval(() => {
  each(userSockets, (socket) => {
    socket.emit('channel1', {
      data: Math.random(),
    });
  });
}, 2000);
