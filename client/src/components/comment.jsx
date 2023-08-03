import React, { useState, useContext, useEffect, useRef } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import Image from './images'

const Comment = ({ comment }) => {
  const time = new Date(comment ?.createdAt).toString().split(' ')

  if(comment) return (

        <div className="flex flex-col rounded-md gap-1 border-b m-1 p-1">
                <div className="flex justify-between">
                  <div className="flex justify-between items-center mb-2">
                    <NavLink to={`/profile/${comment.commentedBy._id}`} className="flex items-center gap-2 px-1">
                      <Image
                        path={comment?.commentedBy?.profileImage}
                        alt="User Avatar" className="w-9 h-9 rounded-full" />

                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{comment.commentedBy?.name}</span>
                        <span className="text-xs -mt-1">{`${time[1]} ${time[2]} ${time[4]}`}</span>
                      </div>
                    </NavLink>
                  </div>
                </div>
                <span className="flex px-8 text-sm -mt-2">{comment.caption}</span>
              
        </div>
    );
};

export default Comment