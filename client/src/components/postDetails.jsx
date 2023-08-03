import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import Post from './post';
import p1 from '../images/image-1.jpg';
import PostReaction from './postReaction';
import { UserContext } from '../userContext';
import NewComment from './newComment'
import Comment from './comment'
import axios from 'axios';
import Image from './images'

const PostDetails = ({post}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  // const [post, setPost] = useState(null);
  const [caption, setCaption] = useState('');
  const { profile, isPostOpen, setIsPostOpen } = useContext(UserContext);

  const time = new Date(post?.createdAt).toString().split(' ');
  const comments = post?.comments;

  const addComment = async (e) => {
            e.preventDefault()

            try {
                const response = await axios.post('/post/comment', {
                    caption,
                    commentedBy: profile._id,
                    post: post._id
                },{withCredentials:true})
                if(response?.data){
                  window.location.reload()
                }

            } catch (error) {
                console.log({ Message: error.message })
            }

    setCaption('');
  };

if(post) return (
      <>
        <button
          onClick={(e) => {
            navigate('/home/feed');
          }}
          className="px-2 py-1 mb-1 flex gap-4 font-semibold text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.9}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
          </svg>
          Back To Feed
        </button>

        <div className="border rounded p-1">
          <div className="bg-white px-3 rounded-lg flex flex-col">
            <Post post={post} />
          </div>

          {/* Adding a new comment */}
          <div className="flex gap-2">
              <NewComment caption = {caption} onChange={setCaption} />
              <button onClick={(e) => addComment(e)}
                type="submit" className="rounded-full text-sky-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.25}
                    stroke="#0369a1"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                  </svg>
                </button>
          </div>
          
          {/*{console.log({comments})}*/}
          {post?.comments && (
            <div className="mb-2 mt-2 rounded-md">
              {post.comments.map((comment) => (
                <Comment comment = {comment} />
              ))}
            </div>
         )}
         </div>
      </>
    );
};

export default PostDetails;
