const express = require('express');
const router = express.Router();
const { createUser, getUsers, loginUser } = require('../controllers/userController');

router.post('/login', loginUser);
router.post('/', createUser);
router.get('/', getUsers);


module.exports = router;
