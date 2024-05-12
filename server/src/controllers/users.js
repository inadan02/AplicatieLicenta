const NextFunction=require('express');

const User=require('../models/users');
const Book =require('../models/books');
const bcrypt=require('bcrypt')
const UserErrors=require('../errors')
const jwt=require('jsonwebtoken')
module.exports.getUsers=getUsers;
module.exports.getUsersById=getUsersById;
module.exports.createUser=createUser;
module.exports.deleteUser=deleteUser;
module.exports.updateUser=updateUser;
module.exports.registerUser=registerUser;
module.exports.logInUser=logInUser;
module.exports.updateBasketUser=updateBasketUser;
module.exports.decodeToken=decodeToken;
module.exports.checkToken=checkToken;
module.exports.addToWishlist=addToWishlist;
module.exports.removeFromWishlist=removeFromWishlist;
module.exports.getUserWishlist=getUserWishlist;
module.exports.getTop10Books=getTop10Books;
//module.exports.verifyToken=verifyToken;

function getUsers(req, res, next) {
    console.log('GET users');
    console.log('QUERY', req.query);
    User.find()
        .then(result => {
            return res.json({ data: result });
        })
        .catch(err => {
            console.log('Error', err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
}

function getUsersById(req,res,next) {
    console.log('GET users by id');
    console.log('QUERY',req.params);
    const userId=req.params.id;
    console.log('userId',userId)
    // return res.json({message: `message susccess GET BY ID = ${userId}`});
    User.findById(userId)
        .then(result => {
            if (!result) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.json({ data: result });
        })
        .catch(err => {
            console.log('Error', err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
}



function createUser(req,res,next) {
    const user=new User(req.body);
    console.log('user',user);
    user.save()
        .then(result => {
            return res.json({ data: result });
        })
        .catch(error => {
            console.log('Error', error);
            return res.status(400).json({ error: 'Error creating user' });
        });
}

function deleteUser(req,res,next) {
    console.log('DELETE users');
    User.findOneAndDelete({ _id: req.params.userId }, { returnOriginal: true })
        .then((result) => {
            if (!result) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ data: result });
        })
        .catch((error) => {
            console.log('Error', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        });
}

function updateUser(req, res, next) {
    const userId=req.params.id
    User.findOneAndUpdate({ _id: userId }, req.body, { new: true })
        .then(updatedUser => {
            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ data: updatedUser });
        })
        .catch(err => {
            res.status(500).json({ error: 'Internal Server Error' });
        });
}
async function updateBasketUser(req, res, next) {
    const userId = req.params.id;
    const booksToAdd = req.body.bookIds; // This should be an array of objects with bookId and quantity

    try {
        // Find the user by ID
        const user = await User.findOne({_id: userId});
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        // Check if booksToAdd is provided and not empty
        if (booksToAdd && booksToAdd.length) {
            for (const {bookId, quantity} of booksToAdd) { // Correctly extract bookId and quantity
                const bookToAdd = await Book.findById(bookId);
                if (!bookToAdd) {
                    return res.status(404).json({error: 'Book not found'});
                }
                // Add book and quantity to the user's basket
                user.basket.books.push({book: bookToAdd._id, quantity: quantity});
            }
            const updatedUser = await user.save();
            res.json({data: updatedUser});
        } else {
            // Handle case where booksToAdd is empty or not provided
            res.status(400).json({error: 'No books provided to add'});
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

async function addToWishlist(req, res, next) {
    const userId = req.params.id;
    const bookId = req.body.bookId;

    try {
        // Find the user by ID
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (bookId) {
            const bookToAdd = await Book.findById(bookId);
            if (!bookToAdd) {
                return res.status(404).json({ error: 'Book not found' });
            }
            // Add book to the user's wishlist
            user.wishlist.books.push({book: bookToAdd._id});
            const updatedUser = await user.save();
            res.json({ data: updatedUser });
        } else {
            // Handle case where bookId is not provided
            res.status(400).json({ error: 'No book provided to add' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}




async function registerUser(req, res, next) {
    const {email, password} = req.body

    try {
        const user = await User.findOne({email},{password});///TODO: pot cauta doar dupa email asai?
        if (user) {
            return res.status(400).json({type: UserErrors.USER_ALREADY_EXISTS})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({email, password: hashedPassword})
        await newUser.save()

        res.json({message: "User registered successfully"})
    }catch(err){
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function removeFromWishlist(req, res, next) {
    const userId = req.params.id;
    const bookId = req.body.bookId;

    try {
        // Find the user by ID
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (bookId) {
            const index = user.wishlist.books.findIndex(item => item.book.toString() === bookId);
            if (index === -1) {
                return res.status(404).json({ error: 'Book not found in wishlist' });
            }
            // Remove the book from the wishlist
            user.wishlist.books.splice(index, 1);
            const updatedUser = await user.save();
            res.json({ data: updatedUser });
        } else {
            // Handle case where bookId is not provided
            res.status(400).json({ error: 'No book provided to remove' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


// async function registerUser(req, res, next) {
//     const { email, password, name } = req.body;
//
//     try {
//         const user = await User.findOne({ email });
//         if (user) {
//             return res.status(400).json({ type: UserErrors.USER_ALREADY_EXISTS });
//         }
//
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new User({ email, password: hashedPassword, name });
//         await newUser.save();
//
//         res.json({ message: "User registered successfully" });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// }

async function logInUser(req, res, next) {
    const {email, password} = req.body
    try {

        const user =await User.findOne({email});
        if (!user) {
            return res.status(400).json({type: UserErrors.NO_USER_FOUND})
        }
        const isPasswordValid=await bcrypt.compare(password,user.password)
        if(!isPasswordValid){
            return res.status(400).json({type:UserErrors.WRONG_CREDENTIALS})
        }
        const token=jwt.sign({id:user._id},"secret")

        res.json({token, userID:user._id})
    }catch(err){
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

//middleware
// const verifyToken = (req,res,next) => {
//     const authHeader = req.headers.authorization
//     if(authHeader){
//         jwt.verify(authHeader,"secret", (err)=>{
//             if(err){
//                 return res.sendStatus(403)
//             }
//             next()
//         })
//     }
//
//     return res.sendStatus(401)//the user is not the correct user so it should not make the request
// }


// function decodeToken(token) {
//     try {
//         //return jwt.verify(token.toString(), "secret");
//         console.log('Decoding token:', token);
//         const decodedToken = jwt.verify(decodeURIComponent(token), "secret");
//         console.log('Decoded token:', decodedToken);
//         return decodedToken;
//     } catch (error) {
//         console.error('Error decoding token:', error.message);
//         return null;
//     }
// }


function isUrlDecoded(str) {
    try {
        return decodeURIComponent(str) === str;
    } catch (e) {
        return false;
    }
}
function decodeToken(req,res) {
    try {
        const token = req.params.token;

        // Check if the token is URL-decoded
        const decodedToken = isUrlDecoded(token) ? token : decodeURIComponent(token);

        console.log('Decoding token:', decodedToken);

        // Use jsonwebtoken's decode function to get the token payload without verification
        const decodedPayload = jwt.decode(decodedToken);

        console.log('Decoded token:', decodedPayload);
       // return decodedPayload;
        res.json({ decodedPayload });
    } catch (error) {
        console.error('Error decoding token:', error.message);
        //return null;
        res.status(500).json({ error: 'Error decoding token' });
    }
}

function checkToken(req, res) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header is missing' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Bearer token is missing' });
        }

        jwt.verify(token, 'secret', (err, decoded) => {
            if (err) {
                console.error('Error verifying token:', err);
                return res.status(403).json({ error: 'Token verification failed' });
            }
            // If verification succeeds, decoded contains the token payload
            console.log('Token verified:', decoded);
            res.status(200).json({ message: 'Token verified', decoded });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


async function getTop10Books(req, res, next) {
    try {
        const allBaskets = await User.find({}, 'basket.books'); // Fetch all baskets from all users

        // Flatten the array of arrays of books into a single array of books
        const allBooks = allBaskets.flatMap(user => user.basket.books);

        // Count the occurrences of each book
        const bookCounts = allBooks.reduce((acc, book) => {
            const { book: bookId, quantity } = book;
            acc[bookId] = (acc[bookId] || 0) + quantity;
            return acc;
        }, {});

        // Sort the book counts in descending order and get the top 10
        const top10Books = Object.entries(bookCounts)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 10);

        // Fetch book details for the top 10 books
        const top10BooksDetails = await Promise.all(
            top10Books.map(async ([bookId, quantity]) => {
                const book = await Book.findById(bookId);
                return { book, quantity };
            })
        );

        res.json({ top10Books: top10BooksDetails });
    } catch (error) {
        console.error('Error fetching top 10 books:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


async function getUserWishlist(req, res, next) {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.json({ data: user.wishlist });
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

