const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cards = require('./routes/cards');
const users = require('./routes/users');

const { PORT = 3000, DATABASE_URL = 'mongodb://localhost/mestodb' } = process.env;

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const notFoundHandler = (res) => res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });

const app = express();
app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use((req, res, next) => {
    req.user = {
      _id: '5f2c3ed595fca24390f93e8d',
    };
    next();
  })
  .use('/', cards, users)
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
