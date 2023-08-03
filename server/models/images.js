import mongoose from 'mongoose'  
const imagesSchema = new mongoose.Schema({
	images:[{
		type:String
	}]
})

export default mongoose.model('Image' , imagesSchema) 