import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import p1 from '../images/image-1.jpg';
import PostReaction from './postReaction';
import { UserContext } from '../userContext';
import Image from './images.jsx'
import baseUrl from './baseUrl.js'

const Post = ({ post , user }) => {
  const {
    profile
  } = useContext(UserContext);
  const time = new Date(post?.createdAt).toString().split(' ');

  const [isExpanded, setIsExpanded] = useState(false);

  const handleReadMore = () => {
    setIsExpanded(true);
  };

  const renderCaption = () => {
  if (isExpanded) {
    const words = post?.caption.split(' ');
    if (words.length > 80) {
      return (
        <>
          {post?.caption}
          <button onClick={() => setIsExpanded(false)} className="read-more-button text-indigo-700 flex justify-start">
            Read Less
          </button>
        </>
      );
    } else {
      return post?.caption;
    }
  } else {
    const words = post?.caption.split(' ');
    if (words.length > 80) {
      const shortenedCaption = words.slice(0, 80).join(' ');
      return (
        <>
          {shortenedCaption}...
          <button onClick={handleReadMore} className="read-more-button text-indigo-700">
            Read More
          </button>
        </>
      );
    } else {
      return post?.caption;
    }
  }
};

// console.log({post})

  if(post) return (
    <div className="bg-white p-2 rounded-lg flex flex-col">
      <div className="flex justify-between">
        <div className="flex justify-between items-center mb-2">
          <NavLink to={`/profile/${post.by?._id || user?._id}`} className="flex items-center">
            <Image
              path={post?.by?.profileImage?post.by.profileImage:user?.profileImage}
              alt="User Avatar"
              className="w-12 h-12 object-cover rounded-full mr-2"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">
                {post.by?.name || user?.name}
              </span>
              <span className="text-xs">{`${time[1]} ${time[2]} ${time[4]}`}</span>
            </div>
          </NavLink>
        </div>
        <NavLink to={`/post/${post._id}`} className="flex-grow "></NavLink>
      </div>

      <div 
        className={`flex flex-col`}
       >
        <div className="p-2">
          <span className="text-sm">{renderCaption()}</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {post.photos.map((src, index) => (
            <NavLink target='_blank' to = {src.includes('https')?src:baseUrl + src} key={index} className="aspect-w-1 aspect-h-1">
              <Image path={src} className="object-cover rounded-md h-full w-full" alt="Post Image"/>
            </NavLink>
          ))}
        </div>
      </div>

      <PostReaction post={post} />
    </div>
  );
};

export default Post;
