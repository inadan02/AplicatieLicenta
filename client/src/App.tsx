import React, {useEffect} from 'react';
import logo from './logo.svg';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css';
import {Navbar} from "./components/navbar";
import LoginPage from "./pages/login";
import ShopPage from "./pages/shop";
import BookDetailsPage from "./pages/book-details";
import AuthPage from "./pages/auth";
import BasketPage from "./pages/basket";
import AddBookPage from "./pages/add-book";
import WishlistPage from "./pages/wishlist";

function App() {
    //TODO asta face clear pe local storage cand inchid aplicatia

    // useEffect(() => {
    //     const handleBeforeUnload = () => {
    //         localStorage.clear();
    //     };
    //
    //     window.addEventListener('beforeunload', handleBeforeUnload);
    //
    //     return () => {
    //         window.removeEventListener('beforeunload', handleBeforeUnload);
    //     };
    // }, []);
    return (
        <Router>
            <div className="App">

                <Navbar/>
                <Routes>
                    <Route path="/" element={<ShopPage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/auth" element={<AuthPage/>}/>
                    <Route path="/user-account"/>
                    <Route path="/checkout" element={<BasketPage/>}/>
                    <Route path="/purchased-items"/>
                    <Route path="/wishlist" element={<WishlistPage/>}/>
                    <Route path="/add-book" element={<AddBookPage/>}/>
                    <Route path="/books/:id" element={<BookDetailsPage/>}/>
                </Routes>

            </div>
        </Router>
    );
}

export default App;
