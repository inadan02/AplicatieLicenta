import {useNavigate} from "react-router-dom";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import {
    AppBar,
    Box,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Modal,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import StarRateSharpIcon from '@mui/icons-material/StarRateSharp';
import {useEffect, useState} from "react";

interface Top10Book {
    book: {
        _id: string;
        title: string;
        author: string;
    };
    quantity: number;
}
export const Navbar = () => {
    const navigate = useNavigate();
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [top10Books, setTop10Books] = useState<Top10Book[]>([]);
    const [openModal, setOpenModal] = useState(false);
    //const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    //const [genres, setGenres] = useState<string[]>([]);
    //const [selectedGenre, setSelectedGenre] = useState<string | null>(null);


    //AM COMENTAT ASTA, NU CRED CA TREBUIE TODO
    // useEffect(() => {
    //     fetch('http://localhost:3000/genres')
    //         .then((response) => {
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             return response.json();
    //         })
    //         .then((data) => {
    //             if (Array.isArray(data.data)) {
    //                 setGenres(data.data);
    //             } else {
    //                 console.error('Data is not an array', data);
    //             }
    //         })
    //         .catch((error) => console.error(error));
    // }, []);

    useEffect(() => {
        const token = localStorage.getItem("Token"); // Assuming AuthToken is the token key
        if (token) {
            setUserLoggedIn(true);
        } else {
            setUserLoggedIn(false);
        }
    }, []);

    const handleOpenWishlist = () => {
        //handle open wishlist
        navigate(`/wishlist`);
    }

    const handleOpenBasket = () => {
        //handle open wishlist
        navigate(`/checkout`);
    }

    const handleViewShop = () => {
        navigate(`/`);
    }

    const handleOpenAddBook = () => {
        navigate(`/add-book`);
    }

    const handleLogout = () => {
        setUserLoggedIn(false);
        localStorage.removeItem("Token");

        navigate("/");
        window.location.reload();

    };

    const handleGetTop10Books = () => {
        fetch('http://localhost:3000/users/all/getTop10Books')
            .then(response => response.json())
            .then(data => {
                console.log(data.top10Books);
                setTop10Books(data.top10Books);

                console.log(top10Books);
                setOpenModal(true);
            })
            .catch(error => {
                console.error('Error fetching top 10 books:', error);
            });
    };

    // const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    //     setAnchorEl(event.currentTarget);
    // };

    // const handleMenuClose = () => {
    //     setAnchorEl(null);
    // };

    // const handleGenreSelect = (genre: string) => {
    //     // Handle the genre selection (you can navigate or filter books based on the selected genre)
    //     console.log(`Selected genre: ${genre}`);
    //     setSelectedGenre(genre);
    //
    //     //navigate(`/books/genres/${genre}`);
    //     handleMenuClose();
    //
    //     // fetch(`http://localhost:3000/books/genres/${genre}`)
    //     //     .then((response) => {
    //     //         if (!response.ok) {
    //     //             throw new Error('Network response was not ok');
    //     //         }
    //     //         return response.json();
    //     //     })
    //     //     .then((data) => {
    //     //         if (Array.isArray(data.data)) {
    //     //             console.log(data.data)
    //     //             setGenres(data.data);
    //     //         } else {
    //     //             console.error('Data is not an array', data);
    //     //         }
    //     //     })
    //     //     .catch((error) => console.error(error));
    //     //
    //     // setSelectedGenre(genre);
    //     // handleMenuClose();
    // };

    // return <div className="navbar">
    //     <div className="navbar-title">
    //         <h1>
    //             My Library
    //         </h1>
    //     </div>
    //
    //     <div className="navbar-links">
    //         <Link to="/">
    //             Books
    //         </Link>
    //         <Link to="/wishlist">
    //             <FontAwesomeIcon icon={faHeart}/>
    //             {/*Wishlist*/}
    //         </Link>
    //         <Link to="/checkout">
    //            <FontAwesomeIcon icon={faShoppingBasket} />
    //
    //         </Link>
    //
    //     </div>
    //
    // </div>

    const handleCloseModal = () => {
        setOpenModal(false);
    };



    return <Box sx={{flexGrow: 1}}>
        <AppBar position="static">
            <Toolbar sx={{background: 'cadetblue'}}>
                {/*<Tooltip title="Genres">*/}
                {/*    <IconButton*/}
                {/*        size="large"*/}
                {/*        edge="start"*/}
                {/*        color="inherit"*/}
                {/*        aria-label="menu"*/}
                {/*        onClick={handleMenuClick}*/}
                {/*        sx={{mr: 2}}*/}
                {/*    >*/}
                {/*        <MenuIcon/>*/}
                {/*    </IconButton>*/}
                {/*</Tooltip>*/}
                {/*<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>*/}
                {/*    {genres.map((genre) => (*/}
                {/*        <MenuItem key={genre} onClick={() => handleGenreSelect(genre)}>*/}
                {/*            {genre.charAt(0).toUpperCase() + genre.slice(1)}*/}
                {/*        </MenuItem>*/}
                {/*    ))}*/}
                {/*</Menu>*/}
                <IconButton size="large" edge="start" color="inherit" onClick={handleViewShop} sx={{mr: 2}}>
                    NkdBooks
                </IconButton>

                <Tooltip title="Add book">
                    <IconButton color="inherit" onClick={handleOpenAddBook} sx={{marginLeft: 'auto'}}>
                        <AddIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="My wishlist">
                    <IconButton color="inherit" onClick={handleOpenWishlist}>
                        <FavoriteIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="My basket">
                    <IconButton color="inherit" onClick={handleOpenBasket}>
                        <ShoppingBasketIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Top 10 Books">
                    <IconButton color="inherit" onClick={handleGetTop10Books}>
                        <StarRateSharpIcon/>
                    </IconButton>
                </Tooltip>
                {userLoggedIn && ( // Render LogoutIcon only if user is logged in
                    <Tooltip title="Logout">
                        <IconButton color="inherit" onClick={handleLogout}>
                            <LogoutIcon/>
                        </IconButton>
                    </Tooltip>
                )}
            </Toolbar>
        </AppBar>
        <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                maxWidth: 400,
                maxHeight: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
                overflowY: 'auto',
            }}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Top 10 Most Bought Books
                </Typography>
                <List>
                    {top10Books.map((entry, index) => (
                        <ListItem key={index}>
                            <ListItemText
                                primary={`${entry.book.title} by ${entry.book.author}`}
                                secondary={`Bought ${entry.quantity} times`}
                            />
                        </ListItem>
                    ))}
                </List>


            </Box>
        </Modal>
    </Box>
}