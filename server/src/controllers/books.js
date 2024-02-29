const Book=require('../models/books');
module.exports.getBooks=getBooks;
module.exports.getBookById=getBookById;
module.exports.createBook=createBook;
module.exports.deleteBook=deleteBook;
module.exports.updateBook=updateBook;
module.exports.getAllGenres=getAllGenres;
module.exports.getBooksByGenre = getBooksByGenre;
module.exports.getBooksByPriceRange = getBooksByPriceRange;
module.exports.getBooksByGenreAndPriceRange = getBooksByGenreAndPriceRange;



function getBooks(req,res,next){
    console.log('GET books');
    console.log('QUERY', req.query);
    Book.find()
        .then(result=>{
            return res.json({data:result});
        })
        .catch(err=>{
            console.log('Error',err);
            res.status(500).json({error: 'Internal Server Error'});
        });
}

function getBookById(req,res,next){
    console.log('GET book by id');
    console.log('QUERY', req.query);
    const bookId=req.params.id;
    console.log("bookId",bookId)
    Book.findById(bookId)
        .then(result => {
            if (!result) {
                return res.status(404).json({ error: 'Book not found' });
            }
            return res.json({ data: result });
        })
        .catch(err => {
            console.log('Error', err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
}

function createBook(req,res,next) {
    const book=new Book(req.body);
    console.log('book',book);
    book.save()
        .then(result => {
            return res.json({ data: result });
        })
        .catch(error => {
            console.log('Error', error);
            return res.status(400).json({ error: 'Error creating book' });
        });
}


function deleteBook(req,res,next) {
    console.log('DELETE book');
    const bookId=req.params.id;
    Book.findOneAndDelete({ _id: bookId }, { returnOriginal: true })
        .then((result) => {
            if (!result) {
                return res.status(404).json({ error: 'Book not found' });
            }
            res.json({ data: result });
        })
        .catch((error) => {
            console.log('Error', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        });
}

function updateBook(req, res, next) {
    const bookId=req.params.id;
    Book.findOneAndUpdate({ _id: bookId }, req.body, { new: true })
        .then(updateBook => {
            if (!updateBook) {
                return res.status(404).json({ error: 'Book not found' });
            }
            res.json({ data: updateBook });
        })
        .catch(err => {
            console.log('Error', err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
}

function getAllGenres(req, res, next) {
    //console.log('GET all genres');

    Book.distinct('genre')
        .then(genres => {
            return res.json({ data: genres });
        })
        .catch(err => {
            console.log('Error', err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
}

function getBooksByGenre(req, res, next) {
    const requestedGenre = req.params.genre;

    // Use a regular expression for case-insensitive search
    const genreRegex = new RegExp(requestedGenre, 'i');

    Book.find({ genre: genreRegex })
        .then((results) => {
            return res.json({ data: results });
        })
        .catch((err) => {
            console.log('Error', err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
}

function getBooksByPriceRange(req, res, next) {
    const minPrice = req.params.minPrice;
    const maxPrice = req.params.maxPrice;

    // Validate that minPrice and maxPrice are numbers
    if (isNaN(minPrice) || isNaN(maxPrice)) {
        return res.status(400).json({ error: 'Invalid price values' });
    }

    // Convert minPrice and maxPrice to numbers
    const minPriceNumber = parseFloat(minPrice);
    const maxPriceNumber = parseFloat(maxPrice);

    // Use the price range for the query
    Book.find({ price: { $gte: minPriceNumber, $lte: maxPriceNumber } })
        .then((results) => {
            return res.json({ data: results });
        })
        .catch((err) => {
            console.log('Error', err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
}

function getBooksByGenreAndPriceRange(req, res, next) {
    const minPrice = req.params.minPrice;
    const maxPrice = req.params.maxPrice;
    const requestedGenre = req.params.genre;

    // Validate that minPrice and maxPrice are numbers
    if (isNaN(minPrice) || isNaN(maxPrice)) {
        return res.status(400).json({ error: 'Invalid price values' });
    }

    // Convert minPrice and maxPrice to numbers
    const minPriceNumber = parseFloat(minPrice);
    const maxPriceNumber = parseFloat(maxPrice);

    // Use the price range and genre for the query
    Book.find({
        price: { $gte: minPriceNumber, $lte: maxPriceNumber },
        genre: { $regex: new RegExp(requestedGenre, 'i') } // Case-insensitive search
    })
        .then((results) => {
            return res.json({ data: results });
        })
        .catch((err) => {
            console.log('Error', err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
}
