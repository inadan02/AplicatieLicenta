import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import {Book} from "../../shared/types"
import {Paper, Typography} from "@mui/material";

const BookDetailsPage = () => {
    const { id } = useParams();
    const [book, setBook] = useState<Book | null>(null);
    //const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Fetch book details using the id parameter
        fetch(`http://localhost:3000/books/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setBook(data.data);
            })
            .catch((error) => console.error(error));
    }, [id]);



    if (!book) {
        return <p>Loading...</p>;
    }

    return (

        <Paper elevation={3} style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <Typography variant="h5" component="div" mb={2}>
                Book Details
            </Typography>
            <Typography variant="body1" mb={1}>
                <strong>Title:</strong> {book.title}
            </Typography>
            <Typography variant="body1" mb={1}>
                <strong>Author:</strong> {book.author}
            </Typography>
            <Typography variant="body1" mb={1}>
                <strong>Genre:</strong> {book.genre}
            </Typography>
            <Typography variant="body1" mb={1}>
                <strong>Description:</strong> {book.description}
            </Typography>
            <Typography variant="body1" mb={1}>
                <strong>Price:</strong> ${book.price.toFixed(2)}
            </Typography>
            <Typography variant="body1" mb={1}>
                <strong>Stock:</strong> {book.stock}
            </Typography>
        </Paper>
    );
};

export default BookDetailsPage;
