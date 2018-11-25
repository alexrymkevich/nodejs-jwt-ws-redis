import { login, validateToken, refreshToken } from '../controllers/Auth';

const express = require('express');

const router = express.Router();

/* GET users listing. */
router.post('/login', login);

router.post('/validateToken', validateToken);

router.post('/refreshToken', refreshToken);


module.exports = router;
