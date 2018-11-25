const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const lessMiddleware = require('less-middleware');
const bodyParser = require('body-parser');
const logger = require('morgan');
const helmet = require('helmet');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const app = express();

app.set('views', path.join(__dirname, '/../../public'));
app.set('view engine', 'html');
app.enable('view cache');
// app.engine('html', require('hogan-express'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, '/../../public')));
app.use(express.static(path.join(__dirname, '/../../public')));

app.use(bodyParser.json({ type: 'application/*+json', limit: '10mb', parameterLimit: 20000 }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb', parameterLimit: 20000 }));

// security
app.use(helmet());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

module.exports = app;
