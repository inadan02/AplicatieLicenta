const mongoose=require('mongoose'); //importez mongoose
const {PORT,DB_URL} =require("../config")

module.exports.init=initMongoose;

function initMongoose(app) {
    console.log('init mongoose')
    console.log(DB_URL)
    mongoose.connect(DB_URL,{
        useNewUrlParser:true,
        // useCreateIndex:true, //vechi si nu mai merg
        // useFindAndModify:false,
        useUnifiedTopology:true
    });

    const db=mongoose.connection;
    db.on('error',console.error.bind(console,'connection error'));
    db.once('open',function(){
        console.log('Connected to DB');
    });

    //if the node process ends, cleanup existing connections
    process.on('SIGINT',cleanup);
    process.on('SIGTERM',cleanup);
    process.on('SIGHUP',cleanup);
}

function cleanup(){
    mongoose.connection.close(function(){
        process.exit();
    });
}