import React from 'react';
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {styled} from "@mui/system";


const LoginButton = styled('button')({
    width: '10%',
    padding: '0.5rem',
    backgroundColor: 'cadetblue',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '2rem', // Add some space below the button
});
const RequireLoginMessage = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div>
            <Typography variant="h5">You need to be logged in order to be able to add a book for sale.</Typography>
            <LoginButton  onClick={handleLogin}>
                Log in
            </LoginButton>
        </div>
    );
};

export default RequireLoginMessage;
