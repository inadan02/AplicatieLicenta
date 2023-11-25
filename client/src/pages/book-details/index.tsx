import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import {Book} from "../../shared/types"

const BookDetailsPage = () => {
    const { id } = useParams();
    const [book, setBook] = useState<Book | null>(null);

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
        // Loading state, or you can show an error message
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>Book Details</h2>
            <p>Title: {book.title}</p>
            <p>Author: {book.author}</p>
            <p>Genre: {book.genre}</p>
            <p>Price: ${book.price.toFixed(2)}</p>
            <p>Stock: {book.stock}</p>
            {/* Display other book details here */}
        </div>
    );
};

export default BookDetailsPage;
