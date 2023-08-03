import { Schema, model } from 'mongoose';

const commentSchema = new Schema({
    caption: {
        type: String,
        required: true
    },
    commentedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    likes: {
        type: Array,
        default: []
    },
    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, { timestamps: true });

export default model('Comment', commentSchema);