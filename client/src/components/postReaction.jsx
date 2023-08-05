import React, { useState, useContext, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../userContext'

const PostReaction = ({ post }) => {
    const { profile, setProfile} = useContext(UserContext)
    const [likeCount, setLikeCount] = useState(post.likes ?.length || 0);
    const [liked, setLiked] = useState(post.likes ?.includes(profile?._id) || false);
    const [commented , setCommented] = useState(post.comments?.includes(profile?._id) || false) 
    const [commentCount , setCommentCount] = useState(post.comments?.length || 0)
    const [caption , setCaption] = useState('') 
    

    const navigate = useNavigate()

    const handlePostLike = async (e) => {
        e.preventDefault()
        if (!profile) alert('Login to like or comment on a post.')
        else {
            try {
            	console.log(post?._id , profile?._id)

                const likeResponse = await axios.post('/post/like', {
                    postId: post ?._id,
                    userId: profile ?._id
                }, { withCredentials: true })

                console.log({ likeResponse })

                if (likeResponse && likeResponse.data && likeResponse.data.post) {
                    setLikeCount(likeResponse.data.post.likes.length);
                    setLiked(likeResponse.data.post.likes.includes(profile._id));
                }


            } catch (error) {
                console.log({ error: error.message })
            }
        }

    }

    const addComment = async(e) => {
    	e.preventDefault() 
    	alert('commented') 

    }

	// console.log({fromPostReaction:post})

	if(post) return (<> 

			<div className="flex justify-between mt-4">
		          <button onClick = {(e) => handlePostLike(e)}
		            className={`flex gap-2 px-12 items-center ${liked?'text-sky-700':'text-gray-700'} focus:outline-none`}>
		            <span className="mt-1">{likeCount>0?likeCount:''}</span>
		            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={liked?2.25:1.5} stroke={liked?'#0369a1':'#334155'} className="w-6 h-6">
		              <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
		            </svg>
		          </button>

		          <button onClick = {e => navigate(`/post/${post?._id}`)}
		            className="flex gap-2 px-12 items-center text-gray-500 hover:text-blue-500 focus:outline-none">
		            <span className="mt-1" >{commentCount >0 ? commentCount : ''}</span>
		            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
		              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
		            </svg>
		          </button>

		          <button onClick = {e => alert('Shared')}
		            className="flex px-12 items-center text-gray-500 hover:text-blue-500 focus:outline-none">
		            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
		              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
		            </svg>
		          </button>
		      </div>

		</>)
}


export default PostReaction