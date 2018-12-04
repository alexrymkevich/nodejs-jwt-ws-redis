import { login, refreshToken, logout } from '../controllers/Auth';

const express = require('express');

const router = express.Router();

/* GET users listing. */
router.post('/login', login);
router.post('/refreshToken', refreshToken);
router.post('/logout', logout);


module.exports = router;
