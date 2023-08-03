import React from 'react';
import {NavLink} from 'react-router-dom'
import Post from './post' 
import Image from './images'
const ProfileContent = ({ user }) => {
  let photos = [];
  const presentYear = new Date().toString().split(' ')[3];

  user?.posts?.forEach((post) => {
    const arr = new Date(post.createdAt)?.toString().split(' ');
    const time = `${arr[2]} ${arr[1]} ${arr[3] === presentYear ? '' : arr[3]}`;

    post.photos?.forEach((photo) => {
      photos.push({
        postId: post._id,
        photo,
        time,
        likes: post.likes.length,
        comments: post.comments.length,
      });
    });
  });

  photos = photos.slice(0,8) 


  return (<>
    <div className=" h-screen overflow-auto">
    <div  className="p-2">
      <div className="text-xl font-bold p-1 py-3">Photos</div>
      <div className="grid grid-cols-3 gap-1">
        {photos.length > 0 &&
          photos.map((item, index) => (
            <NavLink to={item?.photo?.includes('https')?item.photo:`http://localhost:5000/uploads/${item.photo}`} key={index} target="_blank" className="relative">
              <Image
                path={item.photo}
                className="h-36 md:h-48  object-fill w-full rounded-lg"
                alt=""
              />
              <div className="absolute inset-0 flex flex-col gap-2 items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-40 text-white text-center">
                {item.time}
                <div className="flex gap-3">
                    <div className="flex items-center mt-2 brightness-150">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#efefef" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                      <span className="text-gray-100">{item.likes}</span>
                    </div>
                    <div className="flex items-center mt-1 brightness-150">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#efefef" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                      </svg>
                      <span className="text-sky-100">{item.comments}</span>
                    </div>
                </div>
                
              </div>
            </NavLink>
          ))}
      </div>
    </div>

    <div className="p-2 mt-4 mb-12">
      <div className="text-xl font-bold p-1 py-4">Posts</div>
      {user?.posts?.length > 0 && user.posts.map((post , index) => (
          <Post post={post}  user = {user} /> 
      ))}
    </div>
    </div>
  </>);
};

export default ProfileContent;
