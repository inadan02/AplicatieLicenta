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
import {styled} from "@mui/system";

interface PaymentPopupProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const SubmitButton = styled('button')({
    width: '10%',
    padding: '0.5rem',
    backgroundColor: 'cadetblue',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    //cursor: 'pointer',
    marginBottom: '0.5rem',
    marginRight: '0.5rem'
});

const Asterisk = styled('span')({
    color: 'grey',
});

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
    const [isExpirationMonthValid, setIsExpirationMonthValid] = useState(false);
    const [isExpirationYearValid, setIsExpirationYearValid] = useState(false);
    const [isErrorAlertOpen, setIsErrorAlertOpen] = useState(false);
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


    const handleSubmit = () => {
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

    const months = [];
    const currentDateDynamic = new Date();
    const currentYearDynamic = currentDateDynamic.getFullYear();
    const currentMonthDynamic = currentDateDynamic.getMonth() + 1;
    for (let i = currentMonthDynamic; i <= 12; i++) {
        months.push({value: i < 10 ? '0' + i : '' + i, label: (i < 10 ? '0' + i : '' + i)});
    }

    const years = [];
    for (let i = currentYearDynamic; i <= currentYearDynamic + 10; i++) {
        years.push(i);
    }

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
                    required
                />
                <FormControl fullWidth margin="normal" variant="outlined"
                             style={{borderColor: isExpirationMonthValid ? 'green' : 'red'}}>
                    <InputLabel id="expiration-month-label">Expiration Month <Asterisk>*</Asterisk> </InputLabel>
                    <Select
                        labelId="expiration-month-label"
                        value={expirationMonth}
                        onChange={(e) => {
                            setExpirationMonth(e.target.value as string);
                            setIsExpirationMonthValid(true); // Reset validation
                        }}
                        label="Expiration Month"
                    >
                        {months.map((month) => (
                            <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal" variant="outlined"
                             style={{borderColor: isExpirationYearValid ? 'green' : 'red'}}>
                    <InputLabel id="expiration-year-label">Expiration Year <Asterisk>*</Asterisk> </InputLabel>
                    <Select
                        labelId="expiration-year-label"
                        value={expirationYear}
                        onChange={(e) => {
                            setExpirationYear(e.target.value as string);
                            setIsExpirationYearValid(true); // Reset validation
                        }}
                        label="Expiration Year"
                    >
                        {years.map((year) => (
                            <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
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
                    required
                />
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => validateName(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={!isNameValid}
                    required
                />
                <TextField
                    label="Address"
                    value={address}
                    onChange={(e) => validateAddress(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={!isAddressValid}
                    required
                />
            </DialogContent>
            <DialogActions>
                <SubmitButton onClick={handleSubmit} color="primary">
                    Submit
                </SubmitButton>
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
