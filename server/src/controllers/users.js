const NextFunction=require('express');

const User=require('../models/users');
const bcrypt=require('bcrypt')
const UserErrors=require('../errors')
const jwt=require('jsonwebtoken')
module.exports.getUsers=getUsers;
module.exports.getUsersById=getUsersById;
module.exports.createUser=createUser;
module.exports.deleteUser=deleteUser;
module.exports.updateUser=updateUser;
module.exports.registerUser=registerUser;
module.exports.logInUser=logInUser;
//module.exports.verifyToken=verifyToken;

function getUsers(req, res, next) {
    console.log('GET users');
    console.log('QUERY', req.query);
    User.find()
        .then(result => {
            return res.json({ data: result });
        })
        .catch(err => {
            console.log('Error', err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
}

function getUsersById(req,res,next) {
    console.log('GET users by id');
    console.log('QUERY',req.params);
    const userId=req.params.id;
    console.log('userId',userId)
    // return res.json({message: `message susccess GET BY ID = ${userId}`});
    User.findById(userId)
        .then(result => {
            if (!result) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.json({ data: result });
        })
        .catch(err => {
            console.log('Error', err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
}

function createUser(req,res,next) {
    const user=new User(req.body);
    console.log('user',user);
    user.save()
        .then(result => {
            return res.json({ data: result });
        })
        .catch(error => {
            console.log('Error', error);
            return res.status(400).json({ error: 'Error creating user' });
        });
}

function deleteUser(req,res,next) {
    console.log('DELETE users');
    User.findOneAndDelete({ _id: req.params.userId }, { returnOriginal: true })
        .then((result) => {
            if (!result) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ data: result });
        })
        .catch((error) => {
            console.log('Error', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        });
}

function updateUser(req, res, next) {
    const userId=req.params.id
    User.findOneAndUpdate({ _id: userId }, req.body, { new: true })
        .then(updatedUser => {
            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ data: updatedUser });
        })
        .catch(err => {
            res.status(500).json({ error: 'Internal Server Error' });
        });
}

async function registerUser(req, res, next) {
    const {email, password} = req.body

    try {
        const user = await User.findOne({email},{password});///TODO: pot cauta doar dupa email asai?
        if (user) {
            return res.status(400).json({type: UserErrors.USER_ALREADY_EXISTS})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({email, password: hashedPassword})
        await newUser.save()

        res.json({message: "User registered successfully"})
    }catch(err){
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// async function registerUser(req, res, next) {
//     const { email, password, name } = req.body;
//
//     try {
//         const user = await User.findOne({ email });
//         if (user) {
//             return res.status(400).json({ type: UserErrors.USER_ALREADY_EXISTS });
//         }
//
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new User({ email, password: hashedPassword, name });
//         await newUser.save();
//
//         res.json({ message: "User registered successfully" });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// }

async function logInUser(req, res, next) {
    const {email, password} = req.body
    try {

        const user =await User.findOne({email});
        if (!user) {
            return res.status(400).json({type: UserErrors.NO_USER_FOUND})
        }
        const isPasswordValid=await bcrypt.compare(password,user.password)
        if(!isPasswordValid){
            return res.status(400).json({type:UserErrors.WRONG_CREDENTIALS})
        }
        const token=jwt.sign({id:user._id},"secret")

        res.json({token, userID:user._id})
    }catch(err){
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

//middleware
const verifyToken = (req,res,next) => {
    const authHeader = req.headers.authorization
    if(authHeader){
        jwt.verify(authHeader,"secret", (err)=>{
            if(err){
                return res.sendStatus(403)
            }
            next()
        })
    }

    return res.sendStatus(401)//the user is not the correct user so it should not make the request
}

