const express = require('express');
const router = express.Router();
const { createUser, getUsers, loginUser, updateUser, deleteUser } = require('../controllers/userController');

router.post('/login', loginUser);
router.post('/', createUser);
router.get('/', getUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);


module.exports = router;
