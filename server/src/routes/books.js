const express = require('express');
const router=express.Router();
const bookCtrl=require('../controllers/books');

router.get('/books',bookCtrl.getBooks);
router.get('/books/:id',bookCtrl.getBookById);
router.post('/books', bookCtrl.createBook)
router.delete('/books/:id',bookCtrl.deleteBook);
router.put('/books/:id',bookCtrl.updateBook);

module.exports=router;