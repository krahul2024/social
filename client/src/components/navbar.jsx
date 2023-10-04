import React, { useState, useEffect, useRef , useContext} from 'react';
import {NavLink , useNavigate , useLocation} from 'react-router-dom'
import {UserContext} from '../userContext'
import axios from 'axios'
import Image from './images'

const Navbar = () => {
  const location = useLocation() ; // for getting path of current page 
  const currentPath = location.pathname?.split('/'); 
  const navigate = useNavigate() 
  const {profile , setProfile} = useContext(UserContext) ; 
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const notificationsDropdownRef = useRef(null);

  const toggleProfileDropdown = () => {
    setProfileOpen(!isProfileOpen);
  };

  const toggleNotificationsDropdown = () => {
    setNotificationsOpen(!isNotificationsOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }

      if (
        notificationsDropdownRef.current &&
        !notificationsDropdownRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  console.log({profile})
  const getProfileItem = (value , url ) => {
    return (<> 
      <li className="text-gray-300 px-3 text-sm p-1 hover:font-semibold hover:text-gray-200">
        <NavLink to={url}>{value}</NavLink>
      </li>
    </>)
  }

  const handleLogout = async(e) => {
    e.preventDefault() ; 
    try{
      const response = await axios.get('/auth/logout' , {withCredentials:true}) ; 
      if(response?.data?.success) {
        setProfile(null) ; 
        navigate('/home/feed')
      }
    }catch(error){
      console.log({message:error.message})
    }
  }

  return (
    <nav className="bg-gray-800 py-1 px-[6%] md:px-[10%] lg:px-[15%] xl:px-[22%]">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <NavLink to="/home/feed" className="text-gray-200 font-bold text-lg">
            Social
          </NavLink>
        </div>
        <div className="flex items-center justify-center gap-6">

            {/* Notification section from here */}
          <div className="relative z-50" ref={notificationsDropdownRef}>
            <button
              className="text-gray-300 focus:outline-none flex justify-center"
              onClick={toggleNotificationsDropdown}
              ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={`${currentPath.includes('notifications')?'#ffffff':'#94a3b8'}`} className="w-6 h-6">
                  <path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z" clipRule="evenodd" />
                </svg>
              <span className="text-gray-300 mt-2">{profile?.notifications.length>0?profile?.notifications.length:''}</span>
            </button>
            {isNotificationsOpen && (
              <div className="absolute border border-slate-700 w-96 right-0 bg-gray-800 rounded-b-md transition-all duration-1000">
                <ul className="py-1">
                  {profile?.notifications.length>0 && profile?.notifications.slice(0,Math.min(profile?.notifications.length,10))
                    .map((notif, index) => (<>
                      <div className="flex gap-1 px-4 py-1 border-b border-slate-800"> 
                        {notif.user?.photo && (
                            <Image path={notif.user.photo} alt="" className="h-8 w-8 object-cover rounded-full"/>
                        )}
                       {getProfileItem(`${notif.message}` , '/home/notifications')}
                     </div>
                  </>))}
                </ul>
                {profile?.notifications.length>10 && (
                    <div className="flex justify-center">{getProfileItem('View All' , '/home/notifications')}</div>
                  )}
              </div>
            )}
          </div>

          {/* Profile section from here */}
          <div className="relative z-50 w-full" ref={profileDropdownRef}>
            <button
              className="text-gray-300 focus:outline-none rounded-full h-10 w-10 flex justify-center items-center"
              onClick={toggleProfileDropdown}
              >{!profile && 
                (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#e1e1e1" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>)}
                {profile && (
                    <Image path={profile?.profileImage} alt="" className={`h-10 w-10 rounded-full object-cover border-2 ${currentPath.includes(profile?._id)?'border-white':'border-gray-400'}`}/>
                )}
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 border border-slate-700 bg-gray-800 rounded-b-md shadow-sm w-40 transition-all duration-1000">
                {profile && (<ul className="py-1">
                  {getProfileItem('View Profile' , `/profile/${profile?._id}`)}
                  {getProfileItem('Edit Profile' , `/update-profile`)}
                  {getProfileItem('Connections' , '/home/connections')}
                  {getProfileItem('Groups' , '/groups')}
                  <button onClick={(e) => {handleLogout(e)}}
                    className="text-gray-300 px-3 text-sm p-1 hover:font-semibold hover:text-gray-200">
                    Logout
                  </button>
                </ul>
                )}
                {!profile && (<>
                  { getProfileItem('Login' , '/auth')}
                </>)}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
