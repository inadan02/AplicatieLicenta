const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const modelBook=require('./books.js')

const userSchema=new Schema({
    createdAt: Number,
    updatedAt: Number,
    name:{
        type:String
    },
    email:{
        type:String,
        required:[true,'Email is required'],
    },
    password:{
        type:String,
        required:[true,'Password is required'],
    },
    address:{
        type:String
    },
    basket:{
        // books:[{
        //     book: {type: modelBook}
        // }]
        books: [{
            book: {
                type: String
            },
            quantity:{ type: Number}
        }]
    },
    wishlist:{
        books: [{
            book: {
                type: String
            }
        }]
    },
},{timestamps:{currentTime:()=>new Date().getTime()}})

module.exports=mongoose.model('modelUser',userSchema,'Users')
