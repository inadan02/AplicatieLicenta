import {
    Box,
    FormControl,
    Grid, InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Slider, TextField
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {BookCard} from '../../components/book-card'
import {Book} from "../../shared/types"
import {styled} from "@mui/system";
import SearchIcon from '@mui/icons-material/Search';
//import {Label} from "@mui/icons-material";
// interface Book{
//     id:number,
//     title:string,
//     author:string,
//     genre:string,
//     price:number,
//     stock:number
//
// }

const Container = styled(Grid)(({ theme }) => ({
    padding: theme.spacing(2),
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gap: theme.spacing(2),
}));

const GridContainer = styled(Box)({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '30px',
    '& > *:nth-child(n)': {
        marginLeft: '50px', // Adjust the value as needed
    },
});

const LeftBox = styled(Box)({
    width: '200px', // Adjust the width as needed
});
const ColoredSlider = styled(Slider)({
    color: 'cadetblue', // Set the color to cadetblue
});
function valuetext(price: number) {
    return `${price}$`;
}
const marks = [
    {
        value: 0,
        label: '0$',
    },
    {
        value: 150,
        label: '150$',
    },
];
function ShopPage() {
    const [books, setBooks] = useState<Book[]>([]);
   // const [selectedBook, setSelectedBook] = useState<Book | null>(null);
   // const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [genres, setGenres] = useState<string[]>([]);
    //TODO replace with my price
    const [price, setPrice] = React.useState<number[]>([0, 150]);
    const [searchInput, setSearchInput] = useState<string>('');

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    };


    useEffect(() => {
        fetch('http://localhost:3000/genres')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                if (Array.isArray(data.data)) {
                    setGenres(data.data);
                } else {
                    console.error('Data is not an array', data);
                }
            })
            .catch((error) => console.error(error));
    }, []);

    // useEffect(() => {
    //     fetch('http://localhost:3000/books')
    //         .then((response) => {
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             return response.json();
    //         })
    //         .then((data) => {
    //             if (Array.isArray(data.data)) {
    //                 setBooks(data.data);
    //             } else {
    //                 console.error('Data is not an array', data);
    //             }
    //         })
    //         .catch((error) => console.error(error));
    // }, []);

    useEffect(() => {
        const fetchData = async () => {
            let url = `http://localhost:3000/books/${price[0]}/${price[1]}`;
            if (selectedGenre) {
                url = `http://localhost:3000/books/prices/${price[0]}/${price[1]}/genres/${selectedGenre}`;
            }
            //url += `/${price[0]}/${price[1]}`;
            try {
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                if (Array.isArray(data.data)) {
                    const filteredBooks = data.data.filter((book:Book) =>
                        book.title.toLowerCase().includes(searchInput.toLowerCase()) ||
                        book.author.toLowerCase().includes(searchInput.toLowerCase())
                    );
                    setBooks(filteredBooks);
                    //setBooks(data.data);
                } else {
                    console.error('Data is not an array', data);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [selectedGenre, price,searchInput]);

    // const handleBookClick = (book: Book) => {
    //     setSelectedBook(book);
    //     setIsModalOpen(true);
    // };
    //
    // const handleCloseModal = () => {
    //     setIsModalOpen(false);
    // };

    const handleGenreChange = (event: SelectChangeEvent<string>) => {
        setSelectedGenre(event.target.value);
    };

    const handleChange = (event: Event, newValue: number | number[]) => {
        setPrice(newValue as number[]);
    };

    return (
        <Container>
            <LeftBox>
                {/* Content in the left box */}
                <TextField
                    label="Search"
                    variant="outlined"
                    fullWidth
                    value={searchInput}
                    onChange={handleSearchInputChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <FormControl variant="standard" sx={{ minWidth: 140 }}>
                    <InputLabel id="genre-select-label">Filter By Genre</InputLabel>
                    <Select
                        labelId="genre-select-label"
                        id="genre-select"
                        value={selectedGenre || ''}
                        onChange={handleGenreChange}
                    >
                        <MenuItem value="">All</MenuItem>
                        {genres.map((genre) => (
                            <MenuItem key={genre} value={genre}>
                                {genre.charAt(0).toUpperCase() + genre.slice(1)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <ColoredSlider
                    getAriaLabel={() => 'Price range'}
                    value={price}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    getAriaValueText={valuetext}
                    marks={marks}
                    min={0}
                    max={150}
                    sx={{ marginTop: 2 }}
                />
            </LeftBox>

            <GridContainer>
                {books?.map((book) => (
                    <BookCard key={book._id} book={book} />
                ))}
            </GridContainer>
        </Container>
    );
}
export default ShopPage;