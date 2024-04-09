import React, { useEffect, useState } from 'react';
import {useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import {Button, Paper, Typography } from '@mui/material';
import {Book} from "../../shared/types";

const BasketPage = () => {
    const [cartItems, setCartItems] = useState<{ bookId: string; quantity: number }[]>([]);
    const [bookDetails, setBookDetails] = useState<Book[]>([]);
    const navigate = useNavigate();
    let disableBuyButton=false;

    useEffect(() => {
        // Retrieve cart items from localStorage
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
        //TODO
        //pt buton delete book from cart sa dispara si sa se refaca pagina cu totu
    }, []);

    const handleBuy=async () => {
        //TODO verifica ca userul logat si e userul corect ( token decodat=user care se logheaza la care ii iau id-ul dupa parola si email)
        // const userId=localStorage.getItem("Token")
        // const response = await fetch(`http://localhost:3000/users/updateBasket/${userId}`, {
        //     method: 'PUT',
        //     headers: {
        //         'Content-Type': 'application/json; charset=UTF-8',
        //     },
        //     body: JSON.stringify({
        //         //bookId,
        //         //quantity,
        //     }),
        // });
        try {
            const token = localStorage.getItem('Token');
            const response = await fetch(`http://localhost:3000/users/checkJwt/${token}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!token || !response.ok) {
                // If token is not found, redirect the user to the login page
                console.error('Token verification failed');
                navigate('/login');
                return;
            }

            // Token verification succeeded, continue with the buy process
            console.log('Token verified successfully');
            // Place your buy logic here
        } catch (error) {
            console.error('Error verifying token:', error);
            // Handle token verification failure (redirect to login page, show error message, etc.)
            //window.location.href = '/login'; // Redirect to login page
        }
    }
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

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Basket
            </Typography>
            {cartItems.length === 0 ? (
                <Typography>Your basket is empty.</Typography>
            ) : (
                bookDetails.map((bookDetail, index) => (
                    <Paper key={index} elevation={3} style={{ padding: '1rem', marginBottom: '1rem' }}>
                        <Typography variant="h6">{`${bookDetail?.title || 'N/A'}`}</Typography>
                        <Typography>{`Author: ${bookDetail?.author || 'N/A'}`}</Typography>
                        <Typography>{`Quantity: ${cartItems[index].quantity}`}</Typography>
                    </Paper>
                ))
            )}
            {cartItems.length > 0 && <Button onClick={handleBuy}>Buy</Button>}
        </div>
    );
};

export default BasketPage;
