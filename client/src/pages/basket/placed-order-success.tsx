// SuccessMessagePopup.tsx
import React from 'react';
import { Snackbar } from '@mui/material';

interface SuccessMessagePopupProps {
    open: boolean;
    onClose: () => void;
}

const SuccessMessagePopup: React.FC<SuccessMessagePopupProps> = ({ open, onClose }) => {
    return (

        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={open}
            autoHideDuration={3000}
            onClose={onClose}
            message="Order placed successfully!"
        />
    );
};

export default SuccessMessagePopup;
