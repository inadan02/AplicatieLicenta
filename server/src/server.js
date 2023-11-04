const express = require('express')
const app=express() //in app e deja apelata functia express, app e de tipul any sau de tipul express
const dotenv=require("dotenv");
const cors=require("cors")

dotenv.config()

const {PORT,DB_URL} =require("./config")
app.use(cors());
require('./config/express').init(app);
require('./config/routes').init(app);
require('./config/mongoose').init(app);

console.log(PORT)


app.listen(PORT || 3030 )

