import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
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
    width: '50%', // Set the button width to 50% of the form width
    padding: '0.5rem',
    backgroundColor: 'cadetblue',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
});
const ErrorModal = styled(Modal)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

const ModalContent = styled('div')({
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '4px',
    textAlign: 'center',
});

function LoginPage() {
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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent the default form submission behavior

        console.log(email, password);

        try {
            const response = await fetch('http://localhost:3000/users/login', {
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
                // Handle error responses from the server
                const errorData = await response.json();

                if (response.status === 400 && errorData.type === 'no-user-found') {
                    //alert('No user found with the provided email and password.');
                    showError('No user found with the provided email and password.');

                } else if (response.status === 400 && errorData.type === 'wrong-credentials') {
                    //alert('Wrong credentials.');
                    showError('Wrong credentials.');
                } else {
                    //alert('An error occurred. Please try again later.');
                    showError('An error occurred. Please try again later.');


                }
                setEmail('');
                setPassword('');
                return;
            }

            const data = await response.json();

            // Assuming the server responds with a structure like { token: 'your_token_value', userID: 'user_id' }
            const {token, userID} = data;

            // Save the token to local storage
            localStorage.setItem('Token', token);

            // Optionally, you may want to save the user ID or perform other actions

            // Redirect or navigate to another page after successful login
            navigate('/');
        } catch (error) {
            console.error(error);
            //alert('An unexpected error occurred. Please try again later.');
            showError('An unexpected error occurred. Please try again later.');

        }
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
        <Container>
            <h2>Login Page</h2>
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
                <SubmitButton onClick={handleLogin}>Login</SubmitButton>
            </Form>
            {isErrorAlertOpen && (
                <Alert severity="error" onClose={() => setIsErrorAlertOpen(false)}>
                    {errorMessage}
                </Alert>
            )}
        </Container>
    );
}

export default LoginPage;