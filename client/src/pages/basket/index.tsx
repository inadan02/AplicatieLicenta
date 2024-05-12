import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Alert, Button, Paper, Typography} from '@mui/material';
import {Book} from "../../shared/types";
import PaymentPopup from './payment-popup';
import SuccessMessagePopup from "./placed-order-success";
import {styled} from "@mui/system";

const SubmitButton = styled('button')({
    width: '10%',
    padding: '0.5rem',
    backgroundColor: 'cadetblue',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '1rem',
});

const TotalPriceContainer = styled('div')({
    textAlign: 'center',
    marginTop: '1rem',
});

const TotalPrice = styled(Typography)({
    fontWeight: 'bold',
    fontSize: '1.2rem',
    display: 'inline-flex',
    alignItems: 'center',
});

const BasketPage = () => {
    const [cartItems, setCartItems] = useState<{ bookId: string; quantity: number }[]>([]);
    const [bookDetails, setBookDetails] = useState<Book[]>([]);
    const navigate = useNavigate();
    const [isBasketEmpty, setIsBasketEmpty] = useState(false);
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State for success message
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [showLoginMessage, setShowLoginMessage] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        // Retrieve cart items from localStorage
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    useEffect(() => {
        // Check if user is logged in based on token
        const token = localStorage.getItem('Token');
        const checkUserLoggedIn = async () => {
            try {
                if (token) {
                    const response = await fetch(`http://localhost:3000/users/checkJwt/${token}`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.ok) {
                        setUserLoggedIn(true);
                    }
                }
            } catch (error) {
                console.error('Error checking user login:', error);
            }
        };

        checkUserLoggedIn();
    }, []);

    const handleBuy = () => {
        if (userLoggedIn) {
            setShowPaymentPopup(true);
        } else {
            setShowLoginMessage(true); // Show the login message
            setTimeout(() => {
                navigate('/login'); // Redirect to login page after 3 seconds
            }, 1500);
        }
    };


    const handlePaymentSuccess = async () => {
        try {
            const token = localStorage.getItem('Token');
            const response = await fetch(`http://localhost:3000/users/checkJwt/${token}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!token || !response.ok) {
                console.error('Token verification failed');
                navigate('/login');
                return;
            }

            const decodedToken = await response.json();
            const userId = decodedToken.decoded.id;

            const booksToAdd = cartItems.map(item => ({bookId: item.bookId, quantity: item.quantity}));

            const basketResponse = await fetch(`http://localhost:3000/users/updateBasket/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({bookIds: booksToAdd}),
            });
            if (!basketResponse.ok) {
                console.error('Failed to update user basket');
                return;
            }

            for (const {bookId, quantity} of cartItems) {
                const decrementResponse = await fetch(`http://localhost:3000/books/decrementQuantity/${bookId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({quantity}),
                });
                if (!decrementResponse.ok) {
                    console.error(`Failed to decrement quantity for bookId: ${bookId}`);
                }
            }

            localStorage.removeItem('cart');
            setCartItems([]);
            setIsBasketEmpty(true);

            setShowPaymentPopup(false); // Close the payment popup
            setShowSuccessMessage(true);

            //navigate('/confirmation'); // Redirect to the confirmation page after successful payment

        } catch (error) {
            console.error('Error processing payment:', error);
        }
    };

    type BookWithNestedData = {
        data: {
            _id: string;
            title: string;
            author: string;
            genre: string;
            description: string;
            price: number;
            stock: number;
            condition: string;
        };
    };

    const fetchBookDetails = async (bookId: string): Promise<Book | null> => {
        try {
            const response = await fetch(`http://localhost:3000/books/${bookId}`);
            if (!response.ok) {
                console.error(`Failed to fetch book details for bookId: ${bookId}`);
                return null;
            }
            const bookDetail: BookWithNestedData = await response.json();
            const mappedBook: Book = bookDetail?.data || null;
            console.log(`Book details for bookId: ${bookId}`, mappedBook);
            return mappedBook;
        } catch (error) {
            console.error(`Error fetching book details for bookId: ${bookId}`, error);
            return null;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const details = await Promise.all(cartItems.map((item) => fetchBookDetails(item.bookId)));
            setBookDetails(details.filter((detail) => detail !== null) as Book[]);
        };

        fetchData();
    }, [cartItems]);

    useEffect(() => {
        // Calculate total price
        let totalPrice = 0;
        bookDetails.forEach((book, index) => {
            if (book) {
                totalPrice += book.price * cartItems[index].quantity;
            }
        });
        setTotalPrice(totalPrice);
    }, [bookDetails, cartItems]);

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Basket
            </Typography>
            {cartItems.length === 0 ? (
                <Typography>Your basket is empty.</Typography>
            ) : (
                bookDetails.map((bookDetail, index) => (
                    <Paper key={index} elevation={3} style={{padding: '1rem', marginBottom: '1rem'}}>
                        <Typography variant="h6">{`${bookDetail?.title || 'N/A'}`}</Typography>
                        <Typography>{`Author: ${bookDetail?.author || 'N/A'}`}</Typography>
                        <Typography>{`Quantity: ${cartItems[index].quantity}`}</Typography>
                    </Paper>
                ))
            )}
            <TotalPriceContainer>
                <TotalPrice variant="h6">Total: ${totalPrice.toFixed(2)}</TotalPrice>
            </TotalPriceContainer>
            {cartItems.length > 0 && <SubmitButton onClick={handleBuy}>Buy</SubmitButton>}
            <PaymentPopup open={showPaymentPopup} onClose={() => setShowPaymentPopup(false)} onSuccess={handlePaymentSuccess} />
            <SuccessMessagePopup open={showSuccessMessage} onClose={() => setShowSuccessMessage(false)} />
            {showLoginMessage && (
                <Alert severity="info" onClose={() => setShowLoginMessage(false)}>
                    You must be logged in to buy books. Please log in or sign up.
                </Alert>
            )}
        </div>
    );
};

export default BasketPage;
