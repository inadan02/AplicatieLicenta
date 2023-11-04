import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
interface Book{
    title:string,
    author:string
}

function ShopPage() {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        fetch('http://localhost:3000/books')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                if (Array.isArray(data.data)) {
                    setBooks(data.data);
                } else {
                    console.error('Data is not an array', data);
                }
            })
            .catch((error) => console.error(error));
    }, []);

    return (
        <div>
            <h2>Book List</h2>
            {Array.isArray(books) &&
                books.map((book) => (
                    <Card key={book.title}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                {book.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Author: {book.author}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
        </div>
    );
}

export default ShopPage;