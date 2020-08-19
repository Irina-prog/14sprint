const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const asyncHandler = require('express-async-handler');
const helmet = require('helmet');

require('dotenv').config();

const cards = require('./routes/cards');
const users = require('./routes/users');
const {
  createUser, login,
} = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000, DATABASE_URL = 'mongodb://localhost/mestodb' } = process.env;

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const notFoundHandler = (res) => res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });

const app = express();
app
  .use(helmet)
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cookieParser())
  .post('/signup', asyncHandler(createUser))
  .post('/signin', asyncHandler(login))
  .use('/', auth, cards, users)
  .use(express.static(path.join(__dirname, 'public')))
  .use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      notFoundHandler(res);
      return;
    }

    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).send({ message: 'Введены не все обязательные данные' });
      return;
    }

    console.trace(err); // eslint-disable-line no-console
    res.status(500).send({ message: 'Произошла ошибка на сервере' });
  })
  .use((req, res) => {
    notFoundHandler(res);
  });
app.listen(PORT);
