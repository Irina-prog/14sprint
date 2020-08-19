const User = require('../models/user');

// To Reviewer: ошибки обрабатываются в app.js

async function listUsers(req, res) {
  const users = await User.find({});
  res.send(users);
}

async function getUser(req, res) {
  const user = await User.findById(req.params.id).orFail();
  res.send(user);
}

async function createUser(req, res) {
  const user = new User(req.body);
  await user.save();
  res.send(user);
}

async function updateUser(req, res) {
  const { name, about } = req.body;
  const user = await User.findById(req.user._id).orFail();
  user.name = name;
  user.about = about;
  await user.save();
  res.send(user);
}

async function updateAvatar(req, res) {
  const { avatar } = req.body;
  const user = await User.findById(req.user._id).orFail();
  user.avatar = avatar;
  await user.save();
  res.send(user);
}

module.exports = {
  listUsers, getUser, createUser, updateUser, updateAvatar,
};
