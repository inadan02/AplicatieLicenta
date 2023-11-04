import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShoppingBasket, faHeart} from "@fortawesome/free-solid-svg-icons"
export const Navbar=()=>{
    return <div className="navbar">
        <div className="navbar-title">
            <h1>
                My Library
            </h1>
        </div>

        <div className="navbar-links">
            <Link to="/">
                Books
            </Link>
            <Link to="/wishlist">
                <FontAwesomeIcon icon={faHeart}/>
                {/*Wishlist*/}
            </Link>
            <Link to="/checkout">
               <FontAwesomeIcon icon={faShoppingBasket} />

            </Link>

        </div>

    </div>
}