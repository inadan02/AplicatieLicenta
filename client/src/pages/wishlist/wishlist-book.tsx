
import React from "react";
import {Book} from "../../shared/types";

interface Props {
    book: Book;
}

const WishlistBook: React.FC<Props> = ({ book }) => {
    return (
        <div>
            <h2>{book.title}</h2>
            <p>{book.author}</p>
            {/* Add more details as needed */}
        </div>
    );
};

export default WishlistBook;
