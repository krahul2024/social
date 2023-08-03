import React, { useState, useRef, useContext } from 'react';
import { NavLink } from 'react-router-dom'
import Post from './post'
import PostDetails from './postDetails'
import { UserContext } from '../userContext'
import p1 from '../images/image-1.jpg'
import axios from 'axios'
import Image from './images'
const NewComment = ({ caption , onChange }) => {
  const {profile , setProfile } = useContext(UserContext) 
  const handleInput = (e) => {
    e.preventDefault()
    onChange(e.target.value) 
  }

  return (
      <div className="p-1 flex justify-center  rounded-md w-full">
          <div className="py-2 px-1 flex gap-2 justify-center items-center rounded-md w-full">
            <div className="relative w-full">
              <NavLink to="/profile" className="absolute top-2 left-2">
                <Image
                  path={profile?.profileImage}
                  alt=""
                  className="w-8 h-8 rounded-full"
                />
              </NavLink>
              <textarea
                value={caption}
                onChange={(e) => handleInput(e)}
                className="w-full p-1 pl-14 pt-3 outline-0 shadow-sm border rounded-md resize-none overflow-y-auto"
                style={{ maxHeight: '5rem' }}
                placeholder="Comment your thoughts"
                required
              ></textarea>
            </div>

          {/*  <button type="submit" className="rounded-full text-sky-700">
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
            </button>*/}
          </div>
        </div>
  );
};

export default NewComment;
