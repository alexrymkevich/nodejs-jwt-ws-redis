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
      //   return res.status(400).json({ msg: 'Bad Request: User not found' });
      // }
      const user = users.find((usr) => username === usr.username && password === usr.password);
      if (user) {
        const token = authService().createToken({ username: user.username, role: user.role });
        console.log(token);
        user.token = token;
        storeService().set(token, user);
        return res.status(200).json({ token });
      }

      return res.status(401).json({ msg: 'Unauthorized' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  }

  return res.status(400).json({ msg: 'Bad Request: Email or password is wrong' });
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
  const { token } = req.body;
  try {
    authService().verifyToken(token);
    return res.status(200).json({ isvalid: true });
  } catch (err) {
    return res.status(401).json({ isvalid: false, err: 'Invalid Token!' });
  }
}
