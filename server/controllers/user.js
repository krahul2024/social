import mongoose from 'mongoose'
import User from '../models/user.js'
import Post from '../models/post.js'
import Notification from '../models/notification.js'
import crypt from 'crypto'
import {connect} from '../config.js'

const get_hash = (text) => {
    const hash = crypt.createHash('sha512')
    hash.update(text)
    return hash.digest('hex')
}

// Getting user information
export const getUser = async (req, res) => {
    connect()
    try {
        const { id } = req; // Extracting the 'id' from the request body
        const user = await User.findOne({ _id: id })
            .populate('posts connections sentRequests receivedRequests messages notifications')

        res.status(200).send({
            success: true,
            user
        });
    } catch (error) {
        console.log({message:error.message, error}); // Logging the error message
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
};

export const createPost = async (req, res) => {
    connect()
    try {
        const { by, caption, photos } = req.body;

        const newPost = new Post({
            by,
            caption,
            photos
        });

        const user = await User.findById(by)
        if (!user) {
            throw new Error('User not found.');
        }

        const postResponse = await newPost.save();
        if (!postResponse) {
            throw new Error('An error occurred while saving the post.');
        }

        user.posts.push(postResponse._id);
        const updatedUser = await user.save();
        if (!updatedUser) {
            throw new Error('An error occurred while saving the user.');
        }
        await updatedUser.populate('posts connections sentRequests receivedRequests messages notifications')

        return res.status(200).json({
            success: true,
            msg: 'Post created successfully.',
            post: postResponse,
            user: updatedUser
        });
    } catch (error) {
        console.log({ Message: error.message ,error});
        return res.status(500).json({
            success: false,
            msg: 'There was an error while posting.',
        });
    }
};


export const getUserPosts = async (req, res) => {
    connect()
    try {
        const { id } = req;
        const user = await User.findById(id);
        if (!user) throw new Error('User not found.');

        console.log({ postlen: user.posts.length })
        const allPosts = await Post.find({ _id: { $in: user.posts } });
        console.log({ len: allPosts.length })

        return res.status(200).send({
            success: true,
            msg: allPosts.length === user.posts.length ? 'Posts fetched successfully.' : 'Some posts not found!',
            posts: allPosts
        });
    } catch (error) {
        console.error('Error fetching user posts:', error);
        return res.status(500).send({
            success: false,
            msg: 'There was an error while fetching user posts.'
        });
    }
};


export const updateUserDetails = async (req, res) => {
    connect()
    try {
        const { user } = req.body;
        let existingUser = await User.findById(user._id);

        // console.log({ existingUser, user });

        if (!existingUser) {
            throw new Error('No such user exists');
        }

        existingUser.set(user); // Use set() to update the user object
        existingUser = await existingUser.save();
        if (!existingUser) {
            throw new Error('There was a problem updating the user details.');
        }

        await existingUser.populate('posts connections sentRequests receivedRequests messages notifications');
        return res.status(200).send({
            success: true,
            msg: 'User details updated successfully.',
            user: existingUser,
        });

    } catch (error) {
        console.log({ error });
        return res.status(500).send({
            success: false,
            msg: 'An error occurred while updating the user details.',
        });
    }
};


export const getUserById = async (req, res) => {
    connect()
    console.log({id:req.params})
    try {
        const { id } = req.params
        let user;
        if (req.id === id) {
            user = await User.findById(id)
                .populate('posts connections notifications sentRequests receivedRequests messages')
        } else if (req.id !== id) user = await User.findById(id).populate('posts connections');

        if (user === null) throw new Error('Error while getting the user')

        return res.status(200).json({
            success: true,
            msg: 'Fetched user details successfully',
            user
        })

    } catch (error) {
        console.log({ error: error })
        return res.status(500).send({
            success: false,
            msg: 'An error occured while fetching user details!'
        })
    }
}

export const getUserSuggestions = async (req, res) => {
    connect()
    try {
        const { id } = req;

        // getting current user which would recieve suggestions
        const resultUser = await User.findById(id)
            .populate('posts connections sentRequests receivedRequests')

        // getting list of all users we need that for suggestions
        const allUsers = await User.find({})
            .populate('posts connections sentRequests receivedRequests')
        for (let user of allUsers) console.log(user.username, user.notifications.length);
        if (!resultUser || !allUsers) {
            throw new Error('Error fetching suggestions.');
        }

        const nonConnectedUsers = [],
            userConnectionsId = []

        // This is to ensure that suggestions don't include already present connections 
        resultUser.connections.map((conn, index) => {
            userConnectionsId.push(conn.username)
        })
        // This ensures that suggestions don't include already sent requests 
        resultUser.sentRequests.length > 0 && resultUser.sentRequests.map((user, index) => {
            userConnectionsId.push(user.username)
        })

        // This ensures that suggestiosn don't include already received requests 
        resultUser.receivedRequests.length > 0 && resultUser.receivedRequests.map((user, index) => {
            userConnectionsId.push(user.username)
        })

        // now we have respective ids then we can check whether an id is included or not?
        allUsers.map((user, index) => {
            if (!userConnectionsId.includes(user.username) && resultUser.username !== user.username) {
                nonConnectedUsers.push(user)
            }
        })

        console.log({ len: nonConnectedUsers.length })
        const set = new Set(),
            suggestions = []
        if (nonConnectedUsers.length > 4) {
            while (set.size < 4) {
                const randomNum = Math.floor(Math.random() * nonConnectedUsers.length)
                set.add(randomNum)
            }

            const indexes = Array.from(set)
            indexes.map((idx, index) => suggestions.push(nonConnectedUsers[idx]))
        } else {
            nonConnectedUsers.map((item) => {
                // console.log(item.username, resultUser.username)
                if (item.username !== resultUser.username) suggestions.push(item)
            })
        }

        return res.status(200).send({
            success: true,
            suggestions,
            msg: 'Suggestions fetched successfully!',
        });

    } catch (error) {
        console.log({ message: error.message, error });
        return res.status(500).send({
            success: false,
            msg: 'An error occurred.',
        });
    }
};

export const requestConnection = async (req, res) => {
    connect()
    try {
        const { id } = req;
        const { userId } = req.params;
        console.log({ id, userId });

        let fromUser = await User.findById(id);
        let toUser = await User.findById(userId);
        if (!fromUser || !toUser) throw new Error('User Not found');

        // since we have user ids then we have to add touser to list of sent requests  of curent user and 
        // add fromuser to list of received requests of the user who received the request
        fromUser.sentRequests.push(toUser._id);
        toUser.receivedRequests.push(fromUser._id);

        // creating a notification for the user which received requests 
        let notification = new Notification({
            message: 'Connection request received from' + fromUser.name,
            user: {
                id:fromUser._id , 
                name:fromUser.name , 
                username:fromUser.username , 
                photo:fromUser.profileImage
            }
        })
        notification = await notification.save();
        if (!notification) throw new Error('Request not sent');

        // adding notification to the user who received connection request 
        toUser.notifications.push(notification._id);
        const [updatedToUser, updatedFromUser] = await Promise.all([
            toUser.save(),
            fromUser.save()
        ]);
        if (!updatedFromUser || !updatedToUser) {
            throw new Error('An error occurred!');
        }

        await Promise.all([
            updatedFromUser
            .populate('connections sentRequests receivedRequests posts notifications messages'),
            updatedToUser
            .populate('connections posts')
        ]);

        return res.status(200).send({
            success: true,
            msg: 'Connsection request sent.',
            profile: updatedFromUser,
            user: updatedToUser,
        })

    } catch (error) {
        console.log({ error });
        res.status(500).json({
            success: false,
            msg: 'Request not sent',
            error: error.message
        });
    }
};

export const acceptConnection = async (req, res) => {
    connect()
    try {
        const [fromUser, toUser] = await Promise.all([
            User.findById(req.params.userId)
            .populate('connections sentRequests receivedRequests'),
            User.findById(req.id)
            .populate('connections sentRequests receivedRequests'),
        ]);
        if (!fromUser || !toUser) {
            throw new Error('User not found!');
        }

        // Accepting connection
        toUser.connections.push(req.params.userId);
        fromUser.connections.push(req.id);

        // Deleting from sent and received requests
        fromUser.sentRequests = fromUser.sentRequests.filter((request) => request.username !== toUser.username);
        toUser.receivedRequests = toUser.receivedRequests.filter((request) => request.username !== fromUser.username);
        let notif = new Notification({
            message:`${toUser.name} accepted your connection request.`,
            user:{
                id:toUser._id , 
                name:toUser.name , 
                username:toUser.username , 
                photo:toUser.profileImage 
            }
        })

        notif = await notif.save() ; 
        if(!notif) throw new Error('An error occured!') ; 
        fromUser.notifications.push(notif) ; 

        const [updatedToUser, updatedFromUser] = await Promise.all([
            toUser.save(),
            fromUser.save()
        ]);

        if (!updatedFromUser || !updatedToUser) {
            throw new Error('An error occurred!');
        }

        await Promise.all([
            updatedToUser
            .populate('connections sentRequests receivedRequests posts notifications messages'),
            updatedFromUser
            .populate('connections posts')
        ]);

        return res.status(200).send({
            success: true,
            msg: 'Connection request accepted',
            profile: updatedToUser,
            user: updatedFromUser
        });
    } catch (error) {
        console.log({ message: error.message, error });
        return res.status(500).send({
            success: false,
            msg: 'An error occurred processing the request!'
        });
    }
};


export const rejectConnection = async (req, res) => {
    connect()
    try {

        const [toUser, fromUser] = await Promise.all([
            User.findById(req.id).populate('sentRequests').populate('receivedRequests'),
            User.findById(req.params.userId).populate('sentRequests').populate('receivedRequests')
        ]);
        if (!toUser || !fromUser) throw new Error('User not found');

        toUser.receivedRequests = toUser.receivedRequests.filter((request) => request.username !== fromUser.username);
        fromUser.sentRequests = fromUser.sentRequests.filter((request) => request.username !== toUser.username);

        const [updatedToUser, updatedFromUser] = await Promise.all([
            toUser.save().then((user) =>
                user
                .populate('connections posts messages notifications sentRequests receivedRequests')
            ),
            fromUser.save().then((user) =>
                user
                .populate('connections posts')
            )
        ])

        if (updatedFromUser === null || updatedToUser === null) throw new Error('An error occured!')

        return res.status(200).send({
            success: true,
            msg: 'Connection request rejected',
            profile: updatedToUser,
            user: updatedFromUser
        })

    } catch (error) {
        console.log({ message: error.message, error })
        return res.status(500).send({
            success: false,
            msg: 'An error occured!'
        })
    }
}

export const userConnections = async (req, res) => {
    connect()
    try {
        const user = await User.findById(req.id)
            .populate('connections posts messages notifications sentRequests receivedRequests')
            .populate({
                path: 'connections',
                populate: {
                    path: 'connections posts',
                },
            });

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log({ message: error.message, error });
        res.status(500).json({ success: false, msg: 'An error occurred!' });
    }
};

export const getUserMessages = async(req,res)=> {
    connect()
    try{
        const [firstUser , secondUser] = await Promise.all([
            User.findById(req.id)
            .populate('posts connections messages notifications sentRequests receivedRequests'),
            User.findById(req.body.user._id).populate('messages') 
        ])
        if(!firstUser || !secondUser) throw new Error(`Couldn't find the user!`)

        const firstUserMessageIds = new Set(firstUser.messages.map((msg) => msg._id.toString())); // storing all the msg ids of first user messages 
        const messages = secondUser.messages.filter((msg) => firstUserMessageIds.has(msg._id.toString())); // filtering all the messages on the basis of second user messages 

        return res.status(200).send({
            success:true , 
            messages , 
            profile:firstUser , 
        })

    }catch(error){
        console.log({message:error.message , error}) ; 
        return res.status(500).send({
            success:false , 
            msg:'There was an error, Please try again later'
        })
    }
}