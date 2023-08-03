import React, { useState, useRef, useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Post from './post';
import PostDetails from './postDetails';
import { UserContext } from '../userContext';
import NewPost from './newPost';
import axios from 'axios';

const Feed = () => {
  const {
    posts,
    setPosts,
    postIndex,
    setPostIndex,
    profile,
    setProfile ,
  } = useContext(UserContext);
  // console.log({profile})
  const getPosts = async () => {
    try {
      const response = await axios.get('/post/allPosts', { withCredentials: true });
      if (response?.data?.success) {
        setPosts(response?.data?.posts);
      }
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="w-full h-screen overflow-auto mt-4">
      <div className="flex justify-center">
        <div className="">
          {!profile && (
            <div className="flex justify-center p-2">
              <NavLink
                to="/auth"
                className="border rounded-full shadow-lg text-sky-700 px-6 py-2"
              >
                Join the Conversation, Share Your Story!
              </NavLink>
            </div>
          )}

          {profile && <NewPost />}

          { posts.length > 0 &&
            posts.map((post, index) => (
              <div key={index} className="border rounded p-1 m-1">
                <Post post={post} idx={index} />
              </div>
            ))}
          { <PostDetails post={posts[postIndex]} idx={postIndex} />}
        </div>
      </div>
    </div>
  );
};

export default Feed;
