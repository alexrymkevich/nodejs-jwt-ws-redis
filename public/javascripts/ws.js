var socket = null;

function wsConnect(url = 'http://localhost:3010', token) {
  socket = io(url, {query: 'auth_token='+token});
  // Connection failed
  socket.on('error', function(err) {
    throw new Error(err);
  });
  // Connection succeeded
  socket.on('success', function(data) {
    console.log(data.message);
    console.log('user info:', data.user);
  })
  socket.on('channel1', function(data) {
    console.log(data);
  })
}

function login(username, password) {
  let fetchData = {
    method: 'POST',
    body: JSON.stringify({ username: username, password: password}),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
    }
  };

  fetch('http://localhost:3000/auth/login', fetchData )
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) {
      wsConnect('http://localhost:3010', data.token);
    });
}

