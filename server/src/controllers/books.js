const Book=require('../models/books');
module.exports.getBooks=getBooks;
module.exports.getBookById=getBookById;
module.exports.createBook=createBook;
module.exports.deleteBook=deleteBook;
module.exports.updateBook=updateBook;
module.exports.decrementBookQuantity = decrementBookQuantity;
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

// function createBook(req,res,next) {
//     const book=new Book(req.body);
//     console.log('book',book);
//     book.save()
//         .then(result => {
//             return res.json({ data: result });
//         })
//         .catch(error => {
//             console.log('Error', error);
//             return res.status(400).json({ error: 'Error creating book' });
//         });
// }

function createBook(req, res, next) {
    // Extract the user ID from the request body
    const { userId, ...bookData } = req.body;

    // Create a new book object with the provided data
    const book = new Book({ ...bookData, owner: userId });

    console.log('book', book);

    // Save the book to the database
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
function decrementBookQuantity(req, res, next) {
    const bookId = req.params.id;

    // Check if the request includes a quantity to decrement
    if (req.body.quantity !== undefined) {
        // Find the book by ID to get the initial stock value
        Book.findById(bookId)
            .then(book => {
                if (!book) {
                    return res.status(404).json({ error: 'Book not found' });
                }

                // Check if the quantity to decrement is greater than the current stock
                if (req.body.quantity > book.stock) {
                    return res.status(400).json({ error: 'Quantity to decrement exceeds current stock' });
                }

                // Calculate the new stock value by subtracting the quantity
                const newStock = book.stock - req.body.quantity;

                // Update the book with the new stock value
                return Book.findByIdAndUpdate(bookId, { stock: newStock }, { new: true });
            })
            .then(updatedBook => {
                if (!updatedBook) {
                    return res.status(404).json({ error: 'Book not found' });
                }
                res.json({ data: updatedBook });
            })
            .catch(err => {
                console.log('Error decrementing quantity', err);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    } else {
        // If no quantity to decrement is provided, return an error
        res.status(400).json({ error: 'Quantity to decrement not provided' });
    }
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
