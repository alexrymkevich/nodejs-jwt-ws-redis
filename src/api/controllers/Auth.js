import authService from '../services/auth.service';
import storeService from '../services/store.service';

export function login(req, res) {
  const { username, password } = req.body;

  if (username && password) {
    try {
      const users = [{
        username: 'alex',
        role: 'developer',
        password: 'alexpass',
        channels: ['info', 'channel1'],
      },
      {
        username: 'test',
        role: 'manager',
        password: 'test',
        channels: ['info', 'channel2'],
      }];

      // if (!user) {
      //   return res.status(400).json({ message: 'Bad Request: User not found' });
      // }
      let user = users.find((usr) => username === usr.username && password === usr.password);
      if (user) {
        const authData = authService().createToken({ username: user.username, role: user.role });
        user = { ...user, ...authData };
        storeService().set(authData.token, user);
        return res.status(200).json(authData);
      }

      return res.status(401).json({ message: 'Unauthorized' });
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(400).json({ message: 'Bad Request: Email or password is wrong' });
}

export function validateToken(req, res) {
  const { token } = req.body;

  authService().verifyToken(token, (err) => {
    if (err) {
      return res.status(401).json({ isvalid: false, err: 'Invalid Token!' });
    }
    return res.status(200).json({ isvalid: true });
  });
}

export function refreshToken(req, res) {
  const { refreshToken, token } = req.body;
  storeService().get(token).then((userDB) => {
    let user = JSON.parse(userDB);
    if (user && user.refreshToken === refreshToken) {
      const authData = authService().createToken({ username: user.username, role: user.role });
      user = { ...user, ...authData };
      storeService().del(user.token);
      storeService().set(authData.token, user);
      return res.status(200).json(authData);
    }
    return res.status(401).json({ message: 'Invalid Token!', type: 'UNAUTHORIZED' });
  });
}
