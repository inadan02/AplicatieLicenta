import React, {useEffect, useState} from "react";
import {Book} from "../../shared/types";
import ShopPage from "../shop";
import {BookCard} from "../../components/book-card";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Dialog, DialogActions,
    DialogContent, DialogContentText,
    DialogTitle, List, ListItem, ListItemIcon, ListItemText, Snackbar, Tooltip,
    Typography
} from "@mui/material";
import {styled} from "@mui/system";
import {Add, AddShoppingCart, Favorite} from "@mui/icons-material";

interface WishlistItem {
    _id: string;
    book: string;
}

const Container = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
});

const CardContentWrapper = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
});

const ImageWrapper = styled('div')({
    width: '30%',
    paddingTop: '15px',
});

const DetailsWrapper = styled('div')({
    width: '40%',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '10px',
    alignItems: 'center', // Center items horizontally
    justifyContent: 'center', // Center items vertically
});
// const ImageWrapper = styled('div')({
//     flex: 1, // Make the image take up remaining space
//     overflow: 'hidden', // Ensure the image doesn't overflow the wrapper
//     position: 'relative', // Ensure the wrapper is a positioned element
// });

const genreImageMap: Record<string, string> = {
    'fiction': 'blue.png',
    'children': 'yellow.png',
    'classic': 'red.png',
    'psychology': 'green.png',
    // Add more genres as needed
};

const SuccessMessage = styled(Typography)({
    color: 'green',
    marginTop: '10px',
});

function WishlistPage() {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [bookDetails, setBookDetails] = useState<Record<string, Book>>({});
    const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        fetchWishlist();
    }, []);

    useEffect(() => {
        // Fetch book details for each wishlist item
        const fetchBookDetails = async () => {
            try {
                const token = localStorage.getItem('Token');
                const bookIds = wishlistItems.map(item => item.book);
                const promises = bookIds.map(bookId =>
                    fetch(`http://localhost:3000/books/${bookId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json; charset=UTF-8',
                        },
                    })
                );
                const responses = await Promise.all(promises);
                const booksData = await Promise.all(responses.map(res => res.json()));
                const bookDetailsMap: Record<string, Book> = {};
                booksData.forEach((bookData, index) => {
                    const bookId = bookIds[index];
                    const bookDetails = bookData?.data; // Accessing nested data property
                    if (bookDetails) {
                        bookDetailsMap[bookId] = bookDetails;
                    }
                });
                setBookDetails(bookDetailsMap);
            } catch (error) {
                console.error('Error fetching book details:', error);
            }
        };

        if (wishlistItems.length > 0) {
            fetchBookDetails();
        }
    }, [wishlistItems]);

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

            if (response.ok) {
                const wishlistData = await response.json();
                setWishlistItems(wishlistData.data.books);
            } else {
                console.error('Failed to fetch wishlist:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    const handleAddToCart = async (bookId: string) => {
        try {
            const response = await fetch(`http://localhost:3000/books/${bookId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
            });

            if (!response.ok) {
                console.error('Failed to fetch book details:', response.statusText);
                return;
            }

            const bookData = await response.json();
            const book = bookData?.data;

            if (!book) {
                console.error('Book details not found');
                return;
            }

            const existingCart = JSON.parse(localStorage.getItem('cart') ?? '[]');
            const bookFromCart = existingCart.find((item: { bookId: string; }) => item.bookId === bookId);

            if (bookFromCart) {
                const response = await fetch(`http://localhost:3000/books/${bookId}`);
                if (!response.ok) {
                    console.error('Failed to fetch book stock:', response.statusText);
                    return;
                }
                const responseData = await response.json();
                const stock = responseData?.data?.stock;

                if (bookFromCart.quantity >= stock) {
                    console.error('Not enough books in stock');
                    return;
                } else {
                    bookFromCart.quantity++;
                }
            } else {
                existingCart.push({bookId: bookId, quantity: 1});
            }

            localStorage.setItem('cart', JSON.stringify(existingCart));
            console.log('Book added to cart:', book.title);
        } catch (error) {
            console.error('Error adding book to cart:', error);
        }
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
        window.location.reload();
    };

    const handleRecommendBooks = async (genre: string) => {
        // Fetch books with the same genre and stock not equal to 0
        try {
            const response = await fetch(`http://localhost:3000/books/recommend/${genre}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
            });

            if (!response.ok) {
                console.error('Failed to recommend books:', response.statusText);
                return;
            }

            const recommendedBooksData = await response.json();
            console.log('Recommended books:', recommendedBooksData.data);

            setRecommendedBooks(recommendedBooksData.data);
            setShowPopup(true);
        } catch (error) {
            console.error('Error recommending books:', error);
        }
    };
    const handleAddToWishlist = async (event: React.MouseEvent<SVGSVGElement>, bookId: string) => {
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
                return;
            }

            const decodedToken = await responseToken.json();
            const userId = decodedToken.decoded.id;

            const isBookInWishlist = wishlistItems.some(item => item.book === bookId);
            if (isBookInWishlist) {
                setSuccessMessage("Book is already in the wishlist!");
                setSnackbarOpen(true);
                return;
            }

            const response = await fetch(`http://localhost:3000/users/addToWishlist/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({bookId}),
            });

            if (response.ok) {
                setSuccessMessage("Book added to wishlist successfully!");
                setSnackbarOpen(true);
            } else {
                // Handle error response
                console.error('Failed to add to wishlist:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
        }
    };

    return (
        <Container>
            <h2>Wishlist</h2>
            {wishlistItems.map((item: WishlistItem) => (
                <Card key={item._id} sx={{width: '75%', margin: 2}}>
                    <CardContentWrapper>
                        <ImageWrapper>
                            <CardMedia
                                component="img"
                                height="auto"
                                width="100%"
                                image={genreImageMap[bookDetails[item.book]?.genre] || 'purple.png'}
                                alt="book"
                                style={{width: '40%', objectFit: 'cover'}}
                            />
                        </ImageWrapper>
                        <DetailsWrapper>
                            <Typography variant="h5" component="div">
                                {bookDetails[item.book]?.title}
                            </Typography>
                            <Typography color="text.secondary" gutterBottom>
                                Author: {bookDetails[item.book]?.author}
                            </Typography>
                            <Typography variant="body2" component="p">
                                Genre: {bookDetails[item.book]?.genre}
                            </Typography>
                            <Typography variant="body2" component="p">
                                Price: ${bookDetails[item.book]?.price?.toFixed(2)}
                            </Typography>
                            <Typography variant="body2" component="p">
                                {bookDetails[item.book]?.stock === 0 ? 'Out of Stock' : 'In Stock'}
                            </Typography>

                        </DetailsWrapper>
                    </CardContentWrapper>
                    <CardActions>
                        <Tooltip title="Add book to cart">
                            <Button
                                size="small"
                                startIcon={<AddShoppingCart/>}
                                onClick={() => handleAddToCart(item.book)}
                                disabled={bookDetails[item.book]?.stock === 0}
                                sx={{
                                    marginLeft: 'auto', color: 'teal', '&:hover': {
                                        color: 'cadetblue',
                                    }
                                }}
                            >
                                Add to Cart
                            </Button>
                        </Tooltip>
                        <Tooltip title="Books in stock with the same genre">
                            <Button
                                onClick={() => handleRecommendBooks(bookDetails[item.book]?.genre)}
                                sx={{
                                    marginLeft: 'auto', color: 'teal', '&:hover': {
                                        color: 'cadetblue'
                                    }
                                }}
                                size="small"
                                disabled={bookDetails[item.book]?.stock != 0}
                            >
                                Recommendation
                            </Button>
                        </Tooltip>
                    </CardActions>
                </Card>
            ))}
            <Dialog open={showPopup} onClose={togglePopup}>
                <DialogTitle>Recommended Books</DialogTitle>
                <DialogContent>
                    <List>
                        {recommendedBooks.map((book) => (
                            <ListItem key={book._id}>
                                <ListItemIcon>
                                    <Tooltip title="Add to Wishlist">
                                        <Add onClick={(event) => handleAddToWishlist(event, book._id)} />
                                    </Tooltip>
                                </ListItemIcon>
                                <ListItemText
                                    primary={book.title}
                                    secondary={`Author: ${book.author}, Price: $${book.price?.toFixed(2)}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={togglePopup}>Close</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={successMessage}
                sx={{
                    right: '100%',
                    top: '50%', // Adjust as needed
                }}
            />
        </Container>
    );
}

export default WishlistPage;
