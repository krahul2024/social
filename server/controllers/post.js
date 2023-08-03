import User from '../models/user.js';
import Post from '../models/post.js';
import Comment from '../models/comment.js'
import {connect } from '../config.js'
import Notification from '../models/notification.js'

export const getAllPosts = async (req, res) => {
    connect(); 
    try {
        const allPosts = await Post.find({}).populate('by');
        if (!allPosts) throw new Error('An error occurred.');

        const sortedPosts = allPosts.sort((a, b) => {
            const epochA = Date.parse(a.createdAt);
            const epochB = Date.parse(b.createdAt);
            return epochB - epochA;
        });

        const formattedPosts = sortedPosts.map((post) => {
            const createdAt = new Date(post.createdAt);
            const formattedDate = `${createdAt.getDate().toString().padStart(2, '0')}-${(createdAt.getMonth() + 1).toString().padStart(2, '0')}-${createdAt.getFullYear()}`;
            const formattedTime = `${createdAt.getHours().toString().padStart(2, '0')}:${createdAt.getMinutes().toString().padStart(2, '0')}:${createdAt.getSeconds().toString().padStart(2, '0')}`;
            return {
                ...post.toObject(),
                time: `${formattedDate} ${formattedTime}`,
            };
        });

        res.status(200).json({
            success: true,
            posts: formattedPosts,
        });
    } catch (error) {
        console.log({ message: error.message });
        res.status(500).json({
            success: false,
            msg: 'An error occurred.',
        });
    }
};

export const getPostById = async (req, res) => {
    connect(); 
    try {
        const { id } = req.params
        console.log({ id })

        const post = await Post.findOne({ _id: id })
            .populate({
                path:'comments',
                populate:{
                    path:'commentedBy',
                    model:'User'
                }
            })
            .populate('by')

        if (!post) throw new Error(`Couldn't fetch Post! Please try again later.`)

        return res.status(200).send({
            success: true,
            msg: 'Post fetched successfully!',
            post
        })

    } catch (error) {
        console.log({ error: error.message })
        return res.status(500).send({
            success: false,
            msg: `Couldn't fetch the post! Please try again.`
        })
    }
}

export const likePost = async (req, res) => {
    connect() 
    try {
        const { postId, userId } = req.body;
        console.log({ postId, userId });

        let post = await Post.findById(postId)
                    .populate('by')
        if (!post) {
            return res.status(404).json({
                success: false,
                msg: 'Post not found',
            });
        }
        
        let [likedBy , owner] = await Promise.all([
             User.findById(userId) , 
            User.findById(post.by._id) 
        ])
        if(!likedBy || !owner) throw new Error('An error occured'); 

        console.log({ post });
        console.log({ likes: post.likes })

        const liked = post.likes.includes(userId);

        if (liked) {
            const updatedPostLikes = post.likes.filter((item) => item !== userId)
            post.likes = updatedPostLikes
        } else{
            post.likes.push(userId)
            let notif = new Notification({
                message:`${likedBy.name} liked your post`,
                user:{
                    id:likedBy._id , 
                    name:likedBy.name , 
                    username:likedBy.username , 
                    photo:likedBy.profileImage 
                },
                post:post._id
            }); 
            notif = await notif.save() ;
            if(!notif) throw new Error('There was an error!')
            owner.notifications.push(notif) 
        }

        await Promise.all([
            owner.save() , 
            post.save() 
        ]);

        await owner.populate('posts connections sentRequests receivedRequests notifications messages'); 
        return res.status(200).json({
            success: true,
            msg: liked ? 'Post disliked' : 'Post liked',
            post: post,
            user:owner
        });
    } catch (error) {
        console.log({ message: error.message });
        return res.status(500).json({
            success: false,
            msg: error.message,
        });
    }
};

export const addComment = async(req,res) => {
    connect() 
    try{
        const {caption , post } = req.body 
        const {id} = req  
        console.log({id , caption , post}) 

        const resultPost = await Post.findOne({_id:post}) 
        if(!resultPost) throw new Error('Post not found!')

        const newComment = new Comment({
            caption , commentedBy:id , post
        })

        await newComment.save() 
        resultPost.comments.push(newComment._id) 
        await resultPost.save() 

        const fetchedPost = await Post.findOne({ _id: post })
            .populate({
                path:'comments',
                populate:{
                    path:'commentedBy',
                    model:'User'
                }
            })
            .populate('by')

        if (!fetchedPost) throw new Error(`Couldn't fetch Post! Please try again later.`)

        return res.status(200).send({
            success:true , 
            msg:'Comment added successfully!' , 
            comment:newComment , 
            post:fetchedPost
        })

    }catch(error){
        console.log({message:error }) 
        return res.status(500).send({
            success:false , 
            msg:'There was an error!'
        })
    }
}