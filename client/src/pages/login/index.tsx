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
const SubmitButtonContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '1rem', // Adjust the margin-top for vertical spacing
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

const CreateAccountButton = styled('button')({
    width: '50%',
    padding: '0.5rem',
    backgroundColor: 'cadetblue',
    marginTop: '1rem',
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

    const handleRegister = () => {
        navigate('/auth');
    };
    const handleLogin = async (e: React.FormEvent) => {

        e.preventDefault();



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

                    showError('No user found with the provided email and password.');

                } else if (response.status === 400 && errorData.type === 'wrong-credentials') {

                    showError('Wrong credentials.');
                } else {

                    showError('An error occurred. Please try again later.');


                }
                setEmail('');
                setPassword('');
                return;
            }

            const data = await response.json();


            const {token, userID} = data;


            localStorage.setItem('Token', token);



            navigate('/');
            window.location.reload();
        } catch (error) {
            console.error(error);

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
                <SubmitButtonContainer>
                    <SubmitButton onClick={handleLogin}>Login</SubmitButton>
                    <CreateAccountButton onClick={handleRegister}>Create new account</CreateAccountButton>
                </SubmitButtonContainer>
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