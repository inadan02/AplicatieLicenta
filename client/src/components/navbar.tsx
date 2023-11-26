import {Link, useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import {AppBar, Box, IconButton, Toolbar, Tooltip, Typography} from "@mui/material";

export const Navbar = () => {
    const navigate = useNavigate();
    const handleOpenWishlist = () => {
        //handle open wishlist
        navigate(`/wishlist`);
    }

    const handleOpenBasket = () => {
        //handle open wishlist
        navigate(`/checkout`);
    }

    const handleViewShop = () => {
        //handle open wishlist
        navigate(`/`);
    }
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
                <IconButton size="large" edge="start" color="inherit" onClick={handleViewShop} sx={{mr: 2}}>
                    Books
                </IconButton>
                <Tooltip title="My wishlist">
                    <IconButton color="inherit" onClick={handleOpenWishlist} sx={{ marginLeft: 'auto' }}>
                        <FavoriteIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="My basket">
                    <IconButton color="inherit" onClick={handleOpenBasket} >
                        <ShoppingBasketIcon/>
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
    </Box>
}