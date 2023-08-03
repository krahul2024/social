import express from 'express'
const router = express.Router()
import User from '../models/user.js'
import multer from 'multer'
import { verifyToken } from '../middlewares/auth.js'
import imageDownloader from 'image-downloader'
import fs from 'fs'
import {values , connect } from '../config.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname, extname, join } from 'path'
import {S3Client , PutObjectCommand }  from '@aws-sdk/client-s3'

let filePath = path.resolve()

router.get('/', async (req, res) => {
    connect()
    res.json('This is images page')
})

const upload = multer({ dest: '/tmp' });
const bucket = 'rahul-social-bucket' , region = 'ap-south-1'

const uploadToS3 = async(path, originalFilename, mimetype , filename) => {
    connect()
    // client which can be used to upload files to s3 
    const client = new S3Client({
        region,
        credentials:{
            accessKeyId:values.aws_access_key,
            secretAccessKey:values.aws_secret_access_key,
        }
    })
    const data = await client.send( new PutObjectCommand({
        Bucket:bucket,
        Body:fs.readFileSync(path),
        Key:filename,
        ContentType:mimetype,
        ACL:'public-read',
    }))
    return `https://${bucket}.s3.amazonaws.com/${filename}`
}

router.post('/upload', verifyToken, upload.array('photos', 100), async (req, res) => {
    connect()
    const uploads = [],
        { files, id } = req;
    const user = await User.findById(id),
        time = new Date().toString().split(' ')
    if (!user) return res.status(500).send({
        success: false,
        msg: 'Error fetching user information!'
    })

    // now we have user information and we have to construct filename 
    let filename = `${user.username}`
    for (let i = 0; i < 4; i++) filename = filename + '-' +  time[i + 1]; // filename is constructed using username which is unique and time-date and then added numberings like image-1 , image-2 etc.

    // moving on to the upload part of the images which involves renaming and other stuff 
    for (let i = 0; i < files.length; i++) {
        let { path, originalname , mimetype} = files[i],
            temp = originalname?. split('.'),
            extension = `.${temp[temp.length-1]}`,
            newPath = filename + i + extension , 
            updatedPath = newPath.replace(/:/g,'-');
            // fs.renameSync(path, `uploads/${updatedPath}`)
            // uploads.push(updatedPath);
           const resultPath =  await uploadToS3(path, originalname , mimetype , newPath) 
            uploads.push(resultPath);

    }
    console.log({uploads})
    res.json({
        success: true,
        msg: 'successful',
        images: uploads
    })

})


export default router