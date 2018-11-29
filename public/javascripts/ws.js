let socket = null;

function wsConnect(url = 'http://localhost:3010', token) {
  socket = io(url, { query: `auth_token=${token}` });
  // Connection failed
  socket.on('error', (err) => {
    throw new Error(err);
  });
  socket.on('data', (d) => {
    console.log(d);
  });
  socket.on('info', (d) => {
    console.log(d);
  });
  // Connection succeeded
  socket.on('success', (data) => {
    console.log(data.message);
    console.log(data.channels);
    // data.channels.forEach((item) => {
    //   this.on(item, (d) => {
    //     console.log(d);
    //   });
    // });
  });

  setTimeout(() => {
    if (socket) {
      socket.emit('command', { type: 'ADD_CHANNEL', data: 'channel2' });
    }
  }, 5000);
  setTimeout(() => {
    if (socket) {
      socket.emit('command', { type: 'REMOVE_CHANNEL', data: 'channel1' });
    }
  }, 10000);
}

function login(username, password) {
  const fetchData = {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
    },
  };

  fetch('http://localhost:3000/auth/login', fetchData)
    .then((resp) => resp.json()) // Transform the data into json
    .then((data) => {
      wsConnect('http://localhost:3010', data.token);
    });
}

