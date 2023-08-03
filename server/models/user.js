import mongoose from 'mongoose';

const date = new Date().toLocaleString('en-IN');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
    },
    workPlace: {
        type: String,
    },
    hobbies: {
        type: String,
    },
    topics: {
        type: Array,
        default: []
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    }, ],
    connections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }, ],
    sentRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }, ],
    receivedRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }, ],
    profileImage: {
        type: String,
        default: '',
    },
    coverImage: {
        type: String,
        default: '',
    },
    location: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        default: '',
    },
    notifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification',
    }, ],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],

    groups: {
        type: Array,
        default: [],
    },
    token: {
        type: String,
        default: null
    },
}, {
    timestamps: true,
});

export default mongoose.model('User', userSchema);