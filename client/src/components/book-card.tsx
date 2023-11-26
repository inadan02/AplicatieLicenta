import {
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
    CardActionArea,
    ButtonProps,
    Dialog,
    DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import CardMedia from '@mui/material/CardMedia';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {Link, useNavigate} from 'react-router-dom';
import {Book} from "../shared/types";
import {styled} from "@mui/system";
import React, {useState} from "react";
import {AddShoppingCart} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

const StyledCard = styled(Card)({
    maxWidth: 350,
    margin: 3,
    height: '100%', // Set the height to 100% of the parent container
});

const CardContentWrapper = styled(CardContent)({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '200px', // Set the height to 100% of the parent container
});

const ImageWrapper = styled('div')({
    flex: 1, // Make the image take up remaining space
    overflow: 'hidden', // Ensure the image doesn't overflow the wrapper
    position: 'relative', // Ensure the wrapper is a positioned element
});

const HeartIcon = styled(FavoriteIcon)({
    position: 'absolute', // Set the heart icon to an absolute position
    top: 8, // Adjust the top position as needed
    right: 8, // Adjust the right position as needed
    color: 'grey', // Set the initial color to grey
    cursor: 'pointer', // Add cursor pointer for clickability
});

const CenteredCardActions = styled(CardActions)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderTop: '1px solid cadetblue'
});


export const BookCard = ({book}: { book: Book }) => {
    console.log("BOOOK", book);
    const navigate = useNavigate();
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCardClick = () => {
        console.log(book._id)
        console.dir(book)
        //navigate(`/books/${book._id}`); //new age for book details
        setIsModalOpen(true); //pop up for book details
    };

    const handleAddToCart = () => {
        //handle add to cart
    }
    const handleAddToWishlist = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsInWishlist((prevIsInWishlist) => !prevIsInWishlist);
        //navigate('/wishlist')
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const genreImageMap: Record<string, string> = {
        'fiction': 'blue.png',
        'children': 'yellow.png',
        'classic': 'red.png',
        'psychology': 'green.png',
        // Add more genres as needed
    };

    // Get the image URL based on the genre
    const genreImageURL = genreImageMap[book.genre] || 'purple.png';

    //TODO when click book open the book page

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
                        <HeartIcon onClick={(event) => handleAddToWishlist(event)}
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

            {/* Dialog/Modal for Book Details */}
            <Dialog open={isModalOpen} onClose={handleCloseModal}>
                <DialogTitle sx={{ textAlign: 'center', borderBottom: '1px solid #ccc' }}>
                    Book Details
                    <Button onClick={handleCloseModal} sx={{ position: "absolute", right: 0 }}>
                        <CloseIcon />
                    </Button>
                </DialogTitle>
                <DialogContent sx={{ textAlign: 'center', padding: '20px' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold',textAlign: 'center', padding: '20px', color: 'cadetblue' }}>
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
                    {/* Add other book details here */}
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center', borderTop: '1px solid #ccc' }}>
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
                </DialogActions>
            </Dialog>

        </div>
    );
};