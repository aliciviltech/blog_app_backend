import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../model/user.js';
import dotenv from 'dotenv'
dotenv.config()

export const authRoutes = express.Router();


// register / signup / create user in mongoDB
authRoutes.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).send({ message: 'Please fill all the fields' })
    }

    const user = await User.findOne({ email })
    if (user) {
        return res.status(400).send({ message: 'email already exists' })
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        })
        res.send({ message: 'user created successfully', newUser })
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})



// login / get user from mongoDB, find with email
const JWT_SECRETE_KEY = process.env.JWT_SECRETE_KEY
authRoutes.post('/login', async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ message: "Please fill all the fields" })
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).send({ message: "User not found" })
    }
    const isValidPassword = await bcrypt.compare(password, user?.password);
    if (!isValidPassword) {
        return res.status(400).send({ message: "Invalid password" })
    }
    console.log(JWT_SECRETE_KEY)
    const token = jwt.sign({email:user.email, id:user._id}, JWT_SECRETE_KEY, {expiresIn:'60s'})
    
    res.cookie('token', token)
    res.send({message:'Login Success', user:user})
})


// protected route
authRoutes.get('/profile', async(req,res)=>{
    const token = req.cookies.token;
    console.log(token)
    if(!token){
        return res.status(401).send({ message: 'Not logged in' });
    }
    try{
        const decode = jwt.verify(token, JWT_SECRETE_KEY);
        res.send({message:`welcome ${decode.email}`})
    } catch(error){
        res.status(401).send({message:'Invalid Token'})
    }
})

// google signin / get user from mongoDB, find with email
authRoutes.post('/google-signin', async (req, res) => {

    const { email, displayName, uid, photoURL } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        try {
            await User.create({ email: email, name: displayName, _id: uid, user_image: photoURL, password: 'sd@Ds1245FFSasaAS' })
        } catch (error) {
            return res.status(400).send(`Error in backend: ${error}`)
        }
    }
    if (user) {
        // const token = jwt.sign({id:user._id}, process.env.JWT_TOKEN);
        res.status(200).send({ message: "Login successful", data: user })
    }
})


// get all users
authRoutes.get('/get-users',async(req,res)=>{
    try{
        const users = await User.find();
        res.status(200).send(users)
    }catch(error){
        res.status(400).send(error)
    }
    

})

// get single user data from mongo db find with id
authRoutes.get('/get_user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const activeUser = await User.findById(id);
        res.status(200).send({ message: "User data update successful", activeUser })
    } catch (error) {
        res.status(400).send({ message: `Error in getting active user: ${error}` })
    }
})

// update single user data in mongo db
authRoutes.put('/user_update/:id', async (req, res) => {
    const data = req.body;
    const { id } = req.params;

    try {
        const user = await User.findByIdAndUpdate(id, data);
        res.status(200).send({ message: "User data update successful", user: user })
    } catch (error) {
        res.status(400).send({ message: `User data updating error: ${error}` })
    }
})

// logout
authRoutes.post('/logout', (req, res) => {
    res.send('logout')
})

// forget password
authRoutes.post('/forget-password', (req, res) => {
    res.send('forget-password')
})