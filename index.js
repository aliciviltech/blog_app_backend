import express from 'express'
import { blogRoutes } from './routes/blogRoutes.js';
import mongoose from 'mongoose';
import cors from 'cors'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import { authRoutes } from './routes/authRoutes.js';
dotenv.config()

const app = express();
app.use(express.json({ limit: "50mb" }));  // Increase JSON limit
app.use(express.urlencoded({ limit: "50mb", extended: true })); // Increase URL-encoded data limit
app.use(express.json());
// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://baitulblog.vercel.app"
// ];

app.use(cors({
    // origin:'http://localhost:5173',
    origin:'https://baitulblog.vercel.app',
    credentials:true,
}))
app.use(cookieParser())

// routes 
app.get('/', (req,res)=>{
    res.send('Welcome to backend')
})
app.use('/blogs', blogRoutes)
app.use('/auth', authRoutes)

// mongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI).then(()=>console.log('MongoDB Connected successfully'))

// server connection
const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log('Server started:',PORT)
})
