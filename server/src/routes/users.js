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
router.put('/users/updateBasket/:id', userCtrl.updateBasketUser);
router.get('/users/decodeJwt/:token', userCtrl.decodeToken);
router.get('/users/checkJwt/:token', userCtrl.checkToken);

module.exports=router;