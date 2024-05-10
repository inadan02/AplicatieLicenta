export interface Book{
    _id: string;
    title: string;
    author: string;
    genre: string;
    description: string;
    price: number;
    stock: number;
    condition: string;
}

export interface BookOwner{
    _id: string;
    title: string;
    author: string;
    genre: string;
    description: string;
    price: number;
    stock: number;
    condition: string;
    owner: string;
}
