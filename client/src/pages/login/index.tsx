import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';

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

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleLogin = (e:React.FormEvent) => {
        e.preventDefault(); // Prevent the default form submission behavior

        console.log(email, password);
        fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                email,
                password
            })
        }).then(res => {
            return res.json();
        })
            .then(data => {
                navigate('/');
            })
            .catch(error => console.log(error));
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
        </Container>
    );
}

export default LoginPage;