const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const {
  listUsers, getUser, createUser, updateUser, updateAvatar,
} = require('../controllers/users');

const router = new Router();

router.get('/users', asyncHandler(listUsers));
router.post('/users', asyncHandler(createUser));
router.get('/users/:id', asyncHandler(getUser));
router.patch('/users/me', asyncHandler(updateUser));
router.patch('/users/me/avatar', asyncHandler(updateAvatar));

module.exports = router;
