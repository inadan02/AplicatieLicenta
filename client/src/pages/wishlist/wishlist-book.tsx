
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

        </div>
    );
};

export default WishlistBook;
