import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import Post from './post';
import p1 from '../images/image-1.jpg';
import PostDetails from './postDetails';
import { UserContext } from '../userContext';
import ExtraFeed from './extraFeed'
import axios from 'axios';
import Image from './images'

const PostPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [caption, setCaption] = useState('');
  const { profile, isPostOpen, setIsPostOpen } = useContext(UserContext);

  const time = new Date(post?.createdAt).toString().split(' ');
  const comments = post?.comments;

  const getPost = async () => {
    try {
      const postResponse = await axios.get(`/post/${id}`, { withCredentials: true });
      // console.log({ postResponse });
      setPost(postResponse?.data?.post);
    } catch (error) {
      console.log({ error: error.message });
      // alert(error.response.data.msg)
    }
  };
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    getPost();
  }, [id]);

  return (
    <div className="mt-2 px-4">
    {/*This is for mobile screens here only one component is shown*/}
	    {width < 750 && (
	    	<div className="p-2">
	    		<PostDetails post={post} /> 
	    	</div>
	    )}

	    { width < 1200 && width >= 750 && (
	    	<div className="flex gap-2 px-2">
	    		<div className="w-[66%] overflow-y-auto">
	    			<PostDetails post={post} /> 
	    		</div>
	    		<div className="w-[33%] xl:w-[35%]">
	    			<ExtraFeed /> 
	    		</div>
	    	</div>
	    )}

	    {width >= 1200 && (
	    	<div className="flex gap-4 px-16">
	    		<div className="w-[10%]">
	    			
	    		</div>

	    		<div className="w-[60%]">
	    			<PostDetails post={post} /> 
	    		</div>

	    		<div className="w-[27%] 2xl:w-[24%]">
	    			<ExtraFeed />
	    		</div>
	    	</div>
	    )}
    </div>
  );
};

export default PostPage;
