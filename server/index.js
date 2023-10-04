import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { values , connect_database} from './config.js';
// for other services 
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import postRoutes from './routes/post.js';
import imageRoutes from './routes/images.js'

const file_path = path.resolve()

const app = express();
app.use(cookieParser());

app.use(cors({ 'https://rahul-social.vercel.app', credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy' , 1) ; 
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(file_path + '/uploads'))

// Route handlers for various routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/post', postRoutes);
app.use('/images', imageRoutes);

// Connecting to the MongoDB database
mongoose.set('strictQuery', false);
mongoose.set('strictPopulate', false);


app.get('/', (req, res) => {
    res.send('hello bro'); // Route handler for the root endpoint
});


app.listen(values.PORT, () => {
    console.log('Server is running on the port: ' + values.PORT);
});