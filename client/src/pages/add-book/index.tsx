import React, { useState, useEffect } from 'react';
import RequireLoginMessage from './login-message';
import { useNavigate } from 'react-router-dom';
import { Stack, styled } from '@mui/system';
import {
    Button,
    FormControl,
    Input,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextareaAutosize,
    Typography,
} from '@mui/material';

const RedAsterisk = styled('span')({
    color: 'red',
});

const SubmitButton = styled('button')({
    width: '10%',
    padding: '0.5rem',
    backgroundColor: 'cadetblue',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '1rem',
});

const AddBookPage = () => {
    console.log('Component rendered');
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genre: '',
        price: '',
        stock: '',
        condition: '',
        description: '',
        userId: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('Token');
        const checkUserLoggedIn = async () => {
            try {
                if (token) {
                    const response = await fetch(`http://localhost:3000/users/checkJwt/${token}`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.ok) {
                        setUserLoggedIn(true);
                    }
                }
            } catch (error) {
                console.error('Error checking user login:', error);
            }
        };

        checkUserLoggedIn();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        console.log('Input name:', name);
        console.log('Input value:', value);
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        console.log('Updated formData:', formData);
        console.log("AAAAAAAAAAAAA")
    };



    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddBook = async () => {
        try {
            const token = localStorage.getItem('Token');
            const response = await fetch(`http://localhost:3000/users/checkJwt/${token}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!token || !response.ok) {
                console.error('Token verification failed');
                navigate('/login');
                return;
            }



            const decodedToken = await response.json();
            const userId = decodedToken.decoded.id;

            console.log('User ID:', userId);
            formData.userId = userId;
            setFormData(prevState => ({
                ...prevState,
                userId: userId
            }));
            console.log("DATAAAAA", formData.userId);

            const responseAddBook = await fetch('http://localhost:3000/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                    title: formData.title,
                    author: formData.author,
                    genre: formData.genre,
                    price: parseFloat(formData.price),
                    stock: parseFloat(formData.stock),
                    condition: formData.condition,
                    description: formData.description,
                    userId: formData.userId
                }),
            });
            console.log(formData);


            if (responseAddBook.ok) {
                const data = await responseAddBook.json();
                console.log('Book created:', data);
                //navigate('/confirmation');
            } else {
                console.error('Error creating book:', responseAddBook.statusText);
            }
        } catch (error) {
            console.error('Error creating book:', error);
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Add Your Book
            </Typography>
            {userLoggedIn ? (
                <Stack spacing={2}>
                    <FormControl fullWidth>
                        <InputLabel>
                            Title <RedAsterisk>*</RedAsterisk>
                        </InputLabel>
                        <Input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>
                            Author <RedAsterisk>*</RedAsterisk>
                        </InputLabel>
                        <Input type="text" name="author" value={formData.author} onChange={handleInputChange} required />
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>
                            Genre <RedAsterisk>*</RedAsterisk>
                        </InputLabel>
                        <Select name="genre" value={formData.genre} onChange={handleSelectChange} required>
                            <MenuItem value="fantasy">fantasy</MenuItem>
                            <MenuItem value="sci-fi">sci-fi</MenuItem>
                            <MenuItem value="mystery">mystery</MenuItem>
                            <MenuItem value="fiction">fiction</MenuItem>
                            <MenuItem value="classic">classic</MenuItem>
                            <MenuItem value="children">children</MenuItem>
                            <MenuItem value="autobiography">autobiography</MenuItem>
                            <MenuItem value="psychology">psychology</MenuItem>
                            <MenuItem value="other">other</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>
                            Price <RedAsterisk>*</RedAsterisk>
                        </InputLabel>
                        <Input
                            type="number"
                            name="price"
                            placeholder="Price"
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>
                            Stock <RedAsterisk>*</RedAsterisk>
                        </InputLabel>
                        <Input
                            type="number"
                            name="stock"
                            placeholder="Stock"
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            required
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>
                            Condition <RedAsterisk>*</RedAsterisk>
                        </InputLabel>
                        <Select name="condition" value={formData.condition} onChange={handleSelectChange} required>
                            <MenuItem value="new">new</MenuItem>
                            <MenuItem value="used">used</MenuItem>
                            <MenuItem value="old">old</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>
                            Description <RedAsterisk>*</RedAsterisk>
                        </InputLabel>
                        <TextareaAutosize minRows={3} name="description" value={formData.description} onChange={handleInputChange} required />
                    </FormControl>
                    <SubmitButton onClick={handleAddBook}>Add Book</SubmitButton>
                </Stack>
            ) : (
                <RequireLoginMessage />
            )}
        </div>
    );
};

export default AddBookPage;
