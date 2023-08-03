import { model, Schema } from 'mongoose';
const messageSchema = new Schema({
    by: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    text: String,
    photo: String , 

}, { timestamps: true }); 

export default model('Message', messageSchema);