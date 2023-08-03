import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { values , connect} from './config.js';
// for chat services 
import { createServer } from 'http';
import { Server } from 'socket.io'
// for other services 
import jwt from 'jsonwebtoken';
import path from 'path';
import multer from 'multer';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { register } from './controllers/auth.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import postRoutes from './routes/post.js';
import imageRoutes from './routes/images.js'
import { verifyToken } from './middlewares/auth.js';
import Post from './models/post.js'
import { users, posts } from './data/index.js'
import User from './models/user.js'
import Message from './models/message.js'

const file_path = path.resolve()

const app = express();
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy' , 1) ; 
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(file_path + '/uploads'))

// Route handlers for various routes
app.use('/server/auth', authRoutes);
app.use('/server/user', userRoutes);
app.use('/server/post', postRoutes);
app.use('/server/images', imageRoutes);

// Connecting to the MongoDB database
mongoose.set('strictQuery', false);
mongoose.set('strictPopulate', false);


app.get('/server', (req, res) => {
    res.send('hello bro'); // Route handler for the root endpoint
});

// doing all the server related work 
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: true
    }
})

io.on('connection', async (socket) => {
    connect()
    console.log('Connection established with client!');

    // handling the messages 
    socket.on('message', async (data) => {

        connect() 

        let receivedMessage = new Message({
            to: data.to,
            by: data.by,
            text: data.text
        });
        try {
            receivedMessage = await receivedMessage.save(); // saving the received message 
            if (!receivedMessage) throw new Error(`Couldn't send the message!`)

            // finding all the involved users in messaging process 
            let [firstUser, secondUser] = await Promise.all([
                User.findById(receivedMessage.to),
                User.findById(receivedMessage.by)
            ]);
            if (!firstUser || !secondUser) throw new Error('There was an error sending the message!')
            const id = receivedMessage._id.toString() ; 
            //updating users with the messages 
            firstUser.messages.push(id);
            secondUser.messages.push(id);

            const [updatedFirstUser , updatedSecondUser ] = await Promise.all([
                firstUser.save(),
                secondUser.save()
            ]);
            if (!updatedFirstUser || !updatedSecondUser) throw new Error('There was an error sending the message!')
            
            // console.log({f:updatedFirstUser.messages , s:updatedSecondUser.messages , receivedMessage})
            //sending the response as we need to display this on client
            io.emit('response', receivedMessage);
        } 
        catch (error) {
            console.log({message:error.message , error})
            return socket.emit('response', {
                success: false,
                msg: error ?.message || 'An error occured!'
            })
        }
    });


    // checking for disconnection 
    socket.on('disconnect', () => {
        console.log('User disconnected!')
    });
});

server.listen(values.PORT, () => {
    console.log('Server is running on the port: ' + values.PORT);
    // User.insertMany(users);
    // Post.insertMany(posts);
});