const express = require('express');
const router=express.Router();
const bookCtrl=require('../controllers/books');

router.get('/books',bookCtrl.getBooks);
router.get('/books/:id',bookCtrl.getBookById);
router.post('/books', bookCtrl.createBook)
router.delete('/books/:id',bookCtrl.deleteBook);
router.put('/books/:id',bookCtrl.updateBook);
router.put('/books/decrementQuantity/:id', bookCtrl.decrementBookQuantity);
router.get('/genres', bookCtrl.getAllGenres);
router.get('/books/genres/:genre',bookCtrl.getBooksByGenre);
router.get('/books/:minPrice/:maxPrice',bookCtrl.getBooksByPriceRange);
router.get('/books/prices/:minPrice/:maxPrice/genres/:genre',bookCtrl.getBooksByGenreAndPriceRange);


module.exports=router;