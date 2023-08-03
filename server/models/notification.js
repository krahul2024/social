import {Schema , model } from 'mongoose'  
const notificationSchema = new Schema({
	message:{
		type:String , 
		required:true 
	},
	user:{
		id:String , 
		name:String , 
		username:String , 
		photo:String 
	},
	post:{
		type:Schema.Types.ObjectId,
		ref:'Post'
	}
},{timestamp:true})

export default model('Notification' , notificationSchema) 