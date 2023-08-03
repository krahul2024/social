import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    caption: {
        type: String,
    },
    photos: {
        type: Array,
    },
    videos: {
        type: Array,
    },
    songs: {
        type: Array,
    },
    tags: {
        type: Array,
    },
    likes: {
        type: Array
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    location: {
        type: String,
    },
}, {
    timestamps: true,
});

export default mongoose.model('Post', postSchema);