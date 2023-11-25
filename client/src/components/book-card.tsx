import {Card, CardContent, Typography, CardActions, Button, CardActionArea, ButtonProps} from "@mui/material";
import CardMedia from '@mui/material/CardMedia';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {Link, useNavigate} from 'react-router-dom';
import {Book} from "../shared/types";
import {styled} from "@mui/system";
import React, {useState} from "react";
import {purple} from "@mui/material/colors";
import {AddShoppingCart} from "@mui/icons-material";

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
});



export const BookCard = ({book}: { book: Book }) => {
    console.log("BOOOK", book);
    const navigate = useNavigate();
    const [isInWishlist, setIsInWishlist] = useState(false);

    const handleCardClick = () => {
        console.log(book._id)
        console.dir(book)
        navigate(`/books/${book._id}`);
    };

    const handleAddToCart=()=>{
        //handle add to cart
    }
    const handleAddToWishlist=(event: React.MouseEvent)=>{
        event.stopPropagation();
        setIsInWishlist((prevIsInWishlist) => !prevIsInWishlist);
        //navigate('/wishlist')
    }

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
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea onClick={handleCardClick}>
                <ImageWrapper>
                    <CardMedia
                        component="img"
                        height="140"
                        image={genreImageURL}
                        alt="book"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <HeartIcon onClick={(event) => handleAddToWishlist(event)} style={{ color: isInWishlist ? 'red' : 'grey' }}/>
                </ImageWrapper>
                <CardContentWrapper>
                    <Typography variant="h5" component="div" gutterBottom style={{ textAlign: 'center' }}>
                        {book.title}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom style={{ textAlign: 'center' }}>
                        Author: {book.author}
                    </Typography>
                    <Typography variant="body2" component="p" style={{ textAlign: 'center' }}>
                        Price: ${book.price.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" component="p" style={{ textAlign: 'center' }}>
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
    );
};