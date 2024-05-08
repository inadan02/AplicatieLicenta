import React, {useState} from 'react';
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from '@mui/material';
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";

interface PaymentPopupProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const PaymentPopup: React.FC<PaymentPopupProps> = ({open, onClose, onSuccess}) => {
    const [cardNumber, setCardNumber] = useState('');
    const [cvv, setCvv] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [expirationMonth, setExpirationMonth] = useState('');
    const [expirationYear, setExpirationYear] = useState('');
    const [isCardNumberValid, setIsCardNumberValid] = useState(true);
    const [isCvvValid, setIsCvvValid] = useState(true);
    const [isNameValid, setIsNameValid] = useState(true);
    const [isAddressValid, setIsAddressValid] = useState(true);
    const [isExpirationMonthValid, setIsExpirationMonthValid] = useState(true);
    const [isExpirationYearValid, setIsExpirationYearValid] = useState(true);
    const [isErrorAlertOpen, setIsErrorAlertOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState('');

    const validateCardNumber = (value: string) => {
        const formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
        setCardNumber(formattedValue);
        setIsCardNumberValid(/^\d{4} \d{4} \d{4} \d{4}$/.test(formattedValue));
    };

    const validateCvv = (value: string) => {
        setCvv(value);
        setIsCvvValid(/^\d{3}$/.test(value));
    };

    const validateName = (value: string) => {
        setName(value);
        setIsNameValid(value.trim() !== '');
    };

    const validateAddress = (value: string) => {
        setAddress(value);
        setIsAddressValid(value.trim() !== '');
    };

    const validateExpirationDate = () => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = ('0' + (currentDate.getMonth() + 1)).slice(-2);

        if (parseInt(expirationYear) < currentYear ||
            (parseInt(expirationYear) === currentYear && parseInt(expirationMonth) < parseInt(currentMonth))) {
            setIsExpirationYearValid(false);
            setIsExpirationMonthValid(false);
        } else {
            setIsExpirationYearValid(true);
            setIsExpirationMonthValid(true);
        }
    };

    const handleSubmit = () => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = ('0' + (currentDate.getMonth() + 1)).slice(-2);

        if (parseInt(expirationYear) < currentYear ||
            (parseInt(expirationYear) === currentYear && parseInt(expirationMonth) < parseInt(currentMonth))) {
            showError('The expiration date has already passed.');
            return;
        }

        if (!isCardNumberValid || !isCvvValid || !isNameValid || !isAddressValid || !isExpirationMonthValid || !isExpirationYearValid) {
            showError('Please fill in all required fields correctly.');
            return;
        }

        onSuccess();
    };




    const showError = (message: string) => {
        setErrorMessage(message);
        setIsErrorAlertOpen(true);

        // Hide the alert after 3000 milliseconds (3 seconds)
        setTimeout(() => {
            setIsErrorAlertOpen(false);
            setErrorMessage('');
        }, 3000);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <IconButton aria-label="close" onClick={onClose} sx={{position: 'absolute', right: 0, top: 0}}>
                    <CloseIcon/>
                </IconButton>
                Enter Payment Details
            </DialogTitle>
            <DialogContent>
                <TextField
                    label="Card Number"
                    value={cardNumber}
                    onChange={(e) => validateCardNumber(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={!isCardNumberValid}
                />
                <FormControl fullWidth margin="normal" variant="outlined"
                             style={{borderColor: isExpirationMonthValid ? 'green' : 'red'}}>
                    <InputLabel id="expiration-month-label">Expiration Month</InputLabel>
                    <Select
                        labelId="expiration-month-label"
                        value={expirationMonth}
                        onChange={(e) => {
                            setExpirationMonth(e.target.value as string);
                            //setIsExpirationMonthValid(true); // Reset validation
                            validateExpirationDate();
                        }}
                        label="Expiration Month"
                        error={!isExpirationMonthValid}
                    >
                        <MenuItem value="01">January</MenuItem>
                        <MenuItem value="02">February</MenuItem>
                        <MenuItem value="03">March</MenuItem>
                        <MenuItem value="04">April</MenuItem>
                        <MenuItem value="05">May</MenuItem>
                        <MenuItem value="06">June</MenuItem>
                        <MenuItem value="07">July</MenuItem>
                        <MenuItem value="08">August</MenuItem>
                        <MenuItem value="09">September</MenuItem>
                        <MenuItem value="10">October</MenuItem>
                        <MenuItem value="11">November</MenuItem>
                        <MenuItem value="12">December</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal" variant="outlined"
                             style={{borderColor: isExpirationYearValid ? 'green' : 'red'}}>
                    <InputLabel id="expiration-year-label">Expiration Year</InputLabel>
                    <Select
                        labelId="expiration-year-label"
                        value={expirationYear}
                        onChange={(e) => {
                            setExpirationYear(e.target.value as string);
                            //setIsExpirationYearValid(true); // Reset validation
                            validateExpirationDate();
                        }}
                        label="Expiration Year"
                        error={!isExpirationYearValid}
                    >
                        <MenuItem value="2024">2024</MenuItem>
                        <MenuItem value="2025">2025</MenuItem>
                        <MenuItem value="2026">2026</MenuItem>
                        <MenuItem value="2027">2027</MenuItem>
                        <MenuItem value="2028">2028</MenuItem>
                        <MenuItem value="2029">2029</MenuItem>
                        <MenuItem value="2030">2030</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="CVV"
                    value={cvv}
                    onChange={(e) => validateCvv(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={!isCvvValid}
                />
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => validateName(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={!isNameValid}
                />
                <TextField
                    label="Address"
                    value={address}
                    onChange={(e) => validateAddress(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={!isAddressValid}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit} color="primary">
                    Submit
                </Button>
            </DialogActions>
            {isErrorAlertOpen && (
                <Alert severity="error" onClose={() => setIsErrorAlertOpen(false)}>
                    {errorMessage}
                </Alert>
            )}
        </Dialog>
    );
};

PaymentPopup.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired
};



export default PaymentPopup;