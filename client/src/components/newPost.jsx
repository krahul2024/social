import React, { useState, useRef, useContext } from 'react';
import { NavLink , useNavigate } from 'react-router-dom'
import Post from './post'
import PostDetails from './postDetails'
import { UserContext } from '../userContext'
import axios from 'axios'
import Image from './images'

const NewPost = () => {
        const navigate = useNavigate()
        const [postText, setPostText] = useState('') // for posting the text 
        const [imagePreviews, setImagePreviews] = useState([]) // this is for image both base64 and original files
        const {profile , setProfile , posts, setPosts } = useContext(UserContext)
        const [images, setImages] = useState([])

        // for handling changes or addition of images 
        const handleFileChange = (event) => {
            const files = event.target.files;
            const fileArray = Array.from(files);

            fileArray.forEach((file) => {
                const reader = new FileReader();

                reader.onload = (e) => {
                    const image = e.target.result;
                    setImagePreviews((prev) => [...prev, { base: image, original: file }])
                };
                reader.readAsDataURL(file);
            });
        };

        // for deletion of selected images 
        const handleImageRemove = (index) => {
            setImagePreviews((prevPreviews) =>
                prevPreviews.filter((_, i) => i !== index)
            );
        };

        const createNewPost = async (e) => {
            e.preventDefault()

            // preparing the image-files for upload 
            const data = new FormData()
            for (let i = 0; i < imagePreviews.length; i++) {
                data.append('photos', imagePreviews[i].original)
            }

            // uploading the images 
            try {
                const uploadResponse = await axios.post('/images/upload', data, {
                    withCredentials:true
                  })

                setImagePreviews([])
                setPostText('')

                // now as we have got the images so we have to put all the data in format to create a post 
                const postResponse = await axios.post('/user/newPost' , {
                  caption:postText , 
                  photos:uploadResponse.data.images,  
                  by:profile._id
                } , {withCredentials:true})

                const {post , user } = postResponse.data 
                console.log({post , user}) 
                setProfile(user) 
                window.location.reload()
                
            } catch (error) {
                console.log({ error })
                alert(error.message)
            }

        }



  return (
      <div className="bg-white mt-1 shadow-md rounded-md w-full border-b border-l border-r mb-2">
        {/*this is for input text for the post and profile image */}
          <div className="relative">
            <NavLink to={`/profile/${profile?._id}`} className=" absolute top-2 left-2">
              <Image path={profile?.profileImage} alt=""
                className="w-9 h-9 rounded-full"
                />
            </NavLink>
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}  
              className="w-full p-1 pl-14 pt-2 outline-0 shadow-sm rounded-md resize-none overflow-y-auto"
              style={{ maxHeight: '10rem' }}
              placeholder="What's on your mind?"
              required
            ></textarea>
          </div>

          <div className="flex flex-col justify-between ">
            {/*  image preview section   */}
              <div className="grid grid-cols-4 gap-1 p-1">
                  {imagePreviews?.length>0 && imagePreviews?.map((image, index) => (
                    <div key={index} className="relative">
                      <img src={image.base} alt={`Preview ${index}`}
                        className="h-36 w-36 rounded-lg"
                      />
                      <button onClick={() => handleImageRemove(index)} title = "Remove this image."
                        className="absolute bottom-0 right-0 border-2 rounded-full bg-sky-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#f9fafb" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
              </div> 


               {/* This section is for adding images */}
            <div className="flex justify-between items-center px-2 m-1 mb-2">
              {/*   images , videos , gifs  buttons */}
                <div className="flex justify-center items-center gap-3">
                  <label htmlFor="fileInput" className="cursor-pointer" title = "Add images">
                      <input id="fileInput" type="file"  multiple  className="hidden" onChange={handleFileChange} />
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.1} stroke="#0369a1"
                        className="w-7 h-7" >
                        <path strokeLinecap="round" strokeLinejoin="round"  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                  </label>

                  <button className="" title = "Add videos ">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.1} stroke="#0369a1" className="w-7 h-7">
                      <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                    </svg>

                  </button>
                  <button className="" title = "Add gifs">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.1} stroke="#0369a1" className="w-7 h-7">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 8.25v7.5m6-7.5h-3V12m0 0v3.75m0-3.75H18M9.75 9.348c-1.03-1.464-2.698-1.464-3.728 0-1.03 1.465-1.03 3.84 0 5.304 1.03 1.464 2.699 1.464 3.728 0V12h-1.5M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>

                  </button>
              </div>
              {/*create a new  post button */}
              <button type="submit" onClick = {(e) => createNewPost(e)}
                className="px-8 rounded-full py-1 text-sky-700"
                 > <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.25} stroke="#0369a1" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
              </button>
           </div>


            </div>
        </div>
  );
};

export default NewPost;
