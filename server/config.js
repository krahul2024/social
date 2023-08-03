import mongoose from 'mongoose'
import dotenv from 'dotenv' 
dotenv.config() 

export const values = {
	mongo_username:process.env.mongo_username,
	mongo_password:process.env.mongo_password,
	aws_access_key:process.env.aws_access_key,
	aws_secret_access_key:process.env.aws_secret_access_key,
	PORT:process.env.PORT,
	jwt_secret:'1c2ebc88f303b62a6e47121cb7b5acd9f9114ad03fd737c83e18dcfb9684dc327aa098143b10ff198baf2fc3c10294bf7e9e5e9641c6a7e37ed1b6bf2ef78a32',
	time : 7 * 24 * 3600 * 1000,
}

export const connect = () => {
	mongoose.connect('mongodb://0.0.0.0:27017/socialDB', { useNewUrlParser: true })
    .then(() => console.log('Connected to the database successfully!'))
    .catch((error) => {
        console.log(`There was an error connecting to the database. ${error}`); // Printing the error if the connection fails
    });
	// const uri = `mongodb+srv://sandipkumar2024:${values.mongo_password}@cluster0.vwsyauc.mongodb.net/?retryWrites=true&w=majority`;
	// // console.log({uri})
	// mongoose.connect(uri , {
	//  useNewUrlParser:true , useUnifiedTopology:true
	// }).then(() => console.log('Connected to the database successfully'))
	//  .catch(error => console.log('There was an error connecting to the database. Please try again later.' , { error }))
}