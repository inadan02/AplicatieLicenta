import {Box} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {BookCard} from '../../components/book-card'
import {Book} from "../../shared/types"
import {styled} from "@mui/system";
// interface Book{
//     id:number,
//     title:string,
//     author:string,
//     genre:string,
//     price:number,
//     stock:number
//
// }

const Container = styled(Box)({
    padding: '20px',
});

const GridContainer = styled(Box)({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '30px',
    '& > *:nth-child(n)': {
        marginLeft: '50px', // Adjust the value as needed
    },
});
function ShopPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleBookClick = (book: Book) => {
        setSelectedBook(book);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // return (
    //     <div>
    //         <h2>Book List</h2>
    //         {Array.isArray(books) &&
    //             books.map((book) => (
    //                 <Card key={book.title}>
    //                     <CardContent>
    //                         <Typography variant="h5" component="div">
    //                             {book.title}
    //                         </Typography>
    //                         <Typography variant="body2" color="text.secondary">
    //                             Author: {book.author}
    //                         </Typography>
    //                     </CardContent>
    //                 </Card>
    //             ))}
    //     </div>
    // );

    // return (
    //     <Container>
    //         {/*<Typography variant={'h3'} sx={{ color: 'black', marginBottom: 2 }}>*/}
    //         {/*    Books:*/}
    //         {/*</Typography>*/}
    //         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '30px' }}>
    //             {/*{books?.map((book, index) => (*/}
    //             {/*    <BookCard key={index} book={book} />*/}
    //             {/*))}*/}
    //             {books?.map((book) => (
    //                 <BookCard key={book.id} book={book} />
    //             ))}
    //         </div>
    //     </Container>
    // );
    return (
        <Container>
            <GridContainer>
                {books?.map((book) => (
                    <BookCard key={book._id} book={book} />
                ))}
            </GridContainer>

        </Container>
    );

}

export default ShopPage;