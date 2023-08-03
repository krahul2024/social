import express from 'express'
const router = express.Router()
import User from '../models/user.js'
import crypt from 'crypto'
const get_hash = (text) => {
    const hash = crypt.createHash('sha512')
    hash.update(text)
    return hash.digest('hex')
}
import {
    getUser,
    createPost,
    getUserPosts , 
    updateUserDetails , 
    getUserById , 
    getUserSuggestions , 
    requestConnection , 
    acceptConnection,
    rejectConnection , 
    userConnections , 
    getUserMessages
} from '../controllers/user.js'

import { verifyToken } from '../middlewares/auth.js'

router.get('/profile', verifyToken, getUser) // getting user information 

router.post('/newPost', verifyToken, createPost) // creating a new post 

router.get('/allPosts', verifyToken, getUserPosts) // fetching list of all posts 

router.post('/update' , verifyToken , updateUserDetails) // updating user details 

router.post('/suggestions' , verifyToken , getUserSuggestions) // getting suggestions for user

router.get('/requestConnection/:userId' , verifyToken , requestConnection) // for sending connection request 

router.get('/acceptConnection/:userId' , verifyToken , acceptConnection) // for accepting connection request

router.get('/rejectConnection/:userId' , verifyToken , rejectConnection) // for rejecting connection request 

router.get('/userconnections' , verifyToken , userConnections) // for getting detailed information about connections

router.post('/getMessages' , verifyToken , getUserMessages) // for getting all the message of an user with another user 

router.get('/:id' , getUserById) // getting a specific user by its user id 

router.get('/all/refresh' , async(req,res)=> {
    connect()
    const users = await User.find({})  
    users.map(async (user , index) => {
        // user.messages = [] 
        // user.connections = [] 
        // user.sentRequests = []  
        // user.receivedRequests = []
        user.notifications = []
        await user.save() 
    })
})


export default router