import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {styled} from '@mui/system';
import {Alert, Backdrop, Button, Fade, Modal} from "@mui/material";

const Container = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '4rem', // Adjust the margin-top for vertical alignment
});

const Form = styled('form')({
    width: '100%',
    maxWidth: '400px', // Set a maximum width for the form
    textAlign: 'center',
});

const InputField = styled('input')({
    width: '100%', // Input fields take full width of the form
    padding: '0.5rem',
    marginBottom: '1rem',
    fontSize: '14px', // Adjust font size as needed
});

const SubmitButton = styled('button')({
    width: '50%',
    padding: '0.5rem',
    backgroundColor: 'cadetblue',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '1rem', // Add some space below the button
});



function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isErrorAlertOpen, setIsErrorAlertOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };
    const handleAuth = async (e: React.FormEvent) => {

        e.preventDefault();

        //console.log(email, password);

        try {
            const response = await fetch('http://localhost:3000/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (!response.ok) {

                setEmail('');
                setPassword('');
                return;
            }

            navigate('/login');
        } catch (error) {
            console.error(error);
            //alert('An unexpected error occurred. Please try again later.');
            showError('An unexpected error occurred. Please try again later.');

        }
    };

    const showError = (message: string) => {
        setErrorMessage(message);
        setIsErrorAlertOpen(true);


        setTimeout(() => {
            setIsErrorAlertOpen(false);
            setErrorMessage('');
        }, 3000);
    };



    return (
        <Container>
            <h2>Create a new account</h2>
            <Form noValidate>
                <InputField
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange}
                />
                <InputField
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                />
                <SubmitButton onClick={handleAuth}>Register</SubmitButton>
            </Form>

            {isErrorAlertOpen && (
                <Alert severity="error" onClose={() => setIsErrorAlertOpen(false)}>
                    {errorMessage}
                </Alert>
            )}
        </Container>
    );
}

export default AuthPage;