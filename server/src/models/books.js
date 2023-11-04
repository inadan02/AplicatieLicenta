const mongoose=require('mongoose')
const Schema=mongoose.Schema;

const bookSchema=new Schema({
    createdAt: Number,
    updatedAt: Number,
    title:{
        type:String,
        required:[true,'Title is required'],
    },
    author:{
        type:String,
        required:[true,'Author is required'],
    },
    genre:{
        type:String,
        required:[true,'Genre is required'],
    },
    price:{
        type:Number,
        required:[true,'Price is required'],
    },
    stock:{
        type:Number,
        required:[true,'Stock is required'],
    },
    condition:{
        type:String,
        required:[true,'Condition is required'],
    },
    description:{
        type:String,
    },
},{timestamps:{currentTime:()=>new Date().getTime()}})

module.exports=mongoose.model('modelBook',bookSchema,'Books')//collection=tabela in mongo//modelBook e tipul cu care o sa ma refer cand creez un book


//la users la cart vine items si in el am Book:{type:modelBook, require:true}