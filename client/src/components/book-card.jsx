import {
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
    CardActionArea,
    Dialog,
    DialogTitle, DialogContent
} from "@mui/material";
import CardMedia from '@mui/material/CardMedia';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {Book} from "../shared/types";
import {styled} from "@mui/system";
import React, {useEffect, useState} from "react";
import {AddShoppingCart} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import AddToWishlistButton from "../pages/wishlist/wishlist-button";
import {useNavigate} from "react-router-dom";


const CardContentWrapper = styled(CardContent)({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '200px',
});

const ImageWrapper = styled('div')({
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
});

const HeartIcon = styled(FavoriteIcon)({
    position: 'absolute',
    top: 8,
    right: 8,
    color: 'grey',
    cursor: 'pointer',
});

const CenteredCardActions = styled(CardActions)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderTop: '1px solid cadetblue'
});


export const BookCard = ({book}) => {
    //console.log("BOOOK", book);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch and update the user's wishlist when the component mounts
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem('Token');
            const responseToken = await fetch(`http://localhost:3000/users/checkJwt/${token}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!token || !responseToken.ok) {
                console.error('Token verification failed');
                //navigate('/login');
                return;
            }

            const decodedToken = await responseToken.json();
            const userId = decodedToken.decoded.id;
            const response = await fetch(`http://localhost:3000/users/getUserWishlist/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
            });
            //console.log(response)
            if (response.ok) {
                const wishlistData = await response.json();
                console.log(wishlistData)
                //console.log('Type of wishlistData:', typeof wishlistData);
                const wishlistArray = wishlistData.data.books;
                console.log(wishlistArray)
                console.log('Type of wishlistArray:', typeof wishlistArray);
                //wishlistArray(wishlistData.includes(book._id));
                const isInWishlistBoolean = wishlistArray.some(item => item.book === book._id);
                setIsInWishlist(isInWishlistBoolean)
                console.log('Is in wishlist:', isInWishlistBoolean);
            } else {
                console.error('Failed to fetch wishlist:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    const handleCardClick = () => {
        console.log(book._id)
        console.dir(book)
        //navigate(`/books/${book._id}`);
        setIsModalOpen(true);
    };


    const handleAddToCart = async () => {
        const existingCart = JSON.parse(localStorage.getItem('cart') ?? '[]');
        console.log(existingCart)

        const bookFromCart = existingCart.find(item => item.bookId === book._id);
        console.log(bookFromCart)
        const bookId = bookFromCart?.bookId



        if (bookFromCart) {
            console.log(bookId)
            const response = await fetch(`http://localhost:3000/books/${bookId}`);
            if (!response.ok) {
                console.error(`error: ${bookId}`);
                return null;
            }
            const responseData = await response.json();
            const stock = responseData?.data?.stock;
            console.log(stock)
            if (bookFromCart.quantity >= stock) {
                alert("Not enough books in stock!")
            } else {
                // Increment quantity if book is already in the cart
                bookFromCart.quantity++;
            }
        } else {
            // Add a new entry with quantity 1 if book is not in the cart
            existingCart.push({bookId: book._id, quantity: 1});
        }

        localStorage.setItem('cart', JSON.stringify(existingCart));

    };

    const updateQuantityOnServer = async (bookId, quantityChange) => {
        try {
            const response = await fetch(`http://localhost:3000/books/decrementQuantity/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({quantity: quantityChange}),
            });

            if (!response.ok) {
                console.error(`Failed to update quantity for bookId: ${bookId}`);
                return null;
            }

            const updatedBook = await response.json();
            console.log(`Quantity updated for bookId: ${bookId}`, updatedBook);
            return updatedBook.data;
        } catch (error) {
            console.error(`Error updating quantity for bookId: ${bookId}`, error);
            return null;
        }
    };

    const handleAddToWishlist = async (event, bookId) => {
        event.stopPropagation();
        try {
            const token = localStorage.getItem('Token');
            const responseToken = await fetch(`http://localhost:3000/users/checkJwt/${token}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!token || !responseToken.ok) {
                console.error('Token verification failed');
                navigate('/login');
                return;
            }

            const decodedToken = await responseToken.json();
            const userId = decodedToken.decoded.id;

            if (isInWishlist) {
                // Book is already in the wishlist, so remove it
                const response = await fetch(`http://localhost:3000/users/removeFromWishlist/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body: JSON.stringify({bookId}),
                });

                if (response.ok) {
                    setIsInWishlist(false);
                    // Handle success, e.g., show a success message
                } else {
                    // Handle error response
                    console.error('Failed to remove from wishlist:', response.statusText);
                }
            } else {
                // Book is not in the wishlist, so add it
                const response = await fetch(`http://localhost:3000/users/addToWishlist/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body: JSON.stringify({bookId}),
                });

                if (response.ok) {
                    setIsInWishlist(true);
                    // Handle success
                } else {
                    // Handle error response
                    console.error('Failed to add to wishlist:', response.statusText);
                }
            }
        } catch (error) {
            console.error('Error adding/removing to/from wishlist:', error);
        }
    }


    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const genreImageMap = {
        'fiction': 'blue.png',
        'children': 'yellow.png',
        'classic': 'red.png',
        'psychology': 'green.png',

    };


    const genreImageURL = genreImageMap[book.genre] || 'purple.png';


    // @ts-ignore
    return (
        <div>
            <Card sx={{maxWidth: 345}}>
                <CardActionArea onClick={handleCardClick}>
                    <ImageWrapper>
                        <CardMedia
                            component="img"
                            height="140"
                            image={genreImageURL}
                            alt="book"
                            style={{width: '100%', height: '100%', objectFit: 'cover'}}
                        />
                        <HeartIcon onClick={(event) => handleAddToWishlist(event, book._id)}
                                   style={{color: isInWishlist ? 'red' : 'grey'}}/>
                    </ImageWrapper>
                    <CardContentWrapper>
                        <Typography variant="h5" component="div" gutterBottom style={{textAlign: 'center'}}>
                            {book.title}
                        </Typography>
                        <Typography color="textSecondary" gutterBottom style={{textAlign: 'center'}}>
                            Author: {book.author}
                        </Typography>
                        <Typography variant="body2" component="p" style={{textAlign: 'center'}}>
                            Price: ${book.price.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" component="p" style={{textAlign: 'center'}}>
                            {book.stock === 0 ? 'Out of Stock' : `In Stock`}
                        </Typography>
                    </CardContentWrapper>
                </CardActionArea>
                <CenteredCardActions>
                    <Button
                        size="small"
                        startIcon={<AddShoppingCart/>}
                        onClick={handleAddToCart}
                        disabled={book.stock === 0}
                        sx={{
                            color: 'teal',
                            '&:hover': {
                                color: 'cadetblue',
                            },
                        }}
                    >
                        Add to basket
                    </Button>
                </CenteredCardActions>
            </Card>


            <Dialog open={isModalOpen} onClose={handleCloseModal}>
                <DialogTitle sx={{textAlign: 'center', borderBottom: '1px solid #ccc'}}>
                    Book Details
                    <Button onClick={handleCloseModal} sx={{position: "absolute", right: 0}}>
                        <CloseIcon/>
                    </Button>
                </DialogTitle>
                <DialogContent sx={{textAlign: 'center', padding: '20px'}}>
                    <Typography variant="h6" gutterBottom
                                sx={{fontWeight: 'bold', textAlign: 'center', padding: '20px', color: 'cadetblue'}}>
                        {book.title}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                        <strong>Author:</strong> {book.author}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                        <strong>Genre:</strong> {book.genre}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                        <strong>Description:</strong> {book.description}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                        <strong>Price:</strong> ${book.price.toFixed(2)}
                    </Typography>
                    <Typography color="textSecondary">
                        <strong>Stock:</strong> {book.stock}
                    </Typography>

                </DialogContent>

            </Dialog>

        </div>
    );
};