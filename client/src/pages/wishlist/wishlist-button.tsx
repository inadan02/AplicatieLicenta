import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';
import {styled} from "@mui/system";

interface AddToWishlistButtonProps {
    bookId: string; // Specify the type of bookId
}

const HeartIcon = styled(FavoriteIcon)({
    position: 'absolute',
    top: 8,
    right: 8, // Adjusted to left instead of right
    color: 'grey',
    cursor: 'pointer',
});
const AddToWishlistButton: React.FC<AddToWishlistButtonProps> = ({ bookId }) => {
    const [isInWishlist, setIsInWishlist] = useState(false);
    const navigate = useNavigate();

    const handleAddToWishlist = async () => {
        try {
            const token = localStorage.getItem('Token');
            if (!token) {
                // If user is not logged in, redirect to login page
                navigate('/login');
                return;
            }

            const response = await fetch(`http://localhost:3000/users/addToWishlist/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
            });

            if (response.ok) {
                setIsInWishlist(true);
                // Handle success, e.g., show a success message
            } else {
                // Handle error response
                console.error('Failed to add to wishlist:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
        }
    };

    return (
        <IconButton onClick={handleAddToWishlist} color={isInWishlist ? 'primary' : 'default'}>
            <HeartIcon />
        </IconButton>
    );
};

export default AddToWishlistButton;
