const express = require('express');
const router=express.Router();
const userCtrl=require('../controllers/users');

router.get('/users',userCtrl.getUsers);
router.get('/users/:id',userCtrl.getUsersById);
router.post('/users', userCtrl.createUser)
router.delete('/users/:id',userCtrl.deleteUser);
router.put('/users/:id',userCtrl.updateUser);
router.post('/users/register', userCtrl.registerUser);
router.post('/users/login', userCtrl.logInUser);

module.exports=router;