const express = require('express');
const router=express.Router();
const userCtrl=require('../controllers/users');

router.get('/users',userCtrl.getUsers);
router.get('/users/:id',userCtrl.getUsersById);
router.get('/users/getUserWishlist/:id', userCtrl.getUserWishlist);
router.post('/users', userCtrl.createUser)
router.delete('/users/:id',userCtrl.deleteUser);
router.put('/users/:id',userCtrl.updateUser);
router.post('/users/register', userCtrl.registerUser);
router.post('/users/login', userCtrl.logInUser);
router.put('/users/updateBasket/:id', userCtrl.updateBasketUser);
router.put('/users/addToWishlist/:id', userCtrl.addToWishlist);
router.put('/users/removeFromWishlist/:id', userCtrl.removeFromWishlist);
router.get('/users/decodeJwt/:token', userCtrl.decodeToken);
router.get('/users/checkJwt/:token', userCtrl.checkToken);
router.get('/users/all/getTop10Books', userCtrl.getTop10Books);

module.exports=router;