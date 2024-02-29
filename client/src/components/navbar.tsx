import {useNavigate} from "react-router-dom";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import {AppBar, Box, IconButton, Toolbar, Tooltip} from "@mui/material";


export const Navbar = () => {
    const navigate = useNavigate();
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
                <Tooltip title="My wishlist">
                    <IconButton color="inherit" onClick={handleOpenWishlist} sx={{marginLeft: 'auto'}}>
                        <FavoriteIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="My basket">
                    <IconButton color="inherit" onClick={handleOpenBasket}>
                        <ShoppingBasketIcon/>
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
    </Box>
}