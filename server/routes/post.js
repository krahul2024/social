import express from 'express';
import Post from '../models/post.js'
const router = express.Router(); // Create an instance of an Express router
import {
    getAllPosts,
    getPostById,
    likePost , 
    addComment
} from '../controllers/post.js'; // Import the post-related controller functions
import { verifyToken } from '../middlewares/auth.js'; // Import the authentication middleware

router.get('/allPosts', getAllPosts) // getting all the posts for homepage or feed 

router.get('/:id', getPostById) // getting a specific post by its id 

router.post('/like' , verifyToken , likePost) // for liking a post 

router.post('/comment' , verifyToken , addComment) // for adding comment 

router.get('/all/refresh' , async(req,res) => {
    connect()
    const posts = await Post.find({})  
    console.log({posts})
    for(let post of posts) {
        post.comments = [] 
        await post.save() 
    }
    res.json('saved')
})

export default router;