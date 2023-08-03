import React, { useState, useEffect , useContext } from 'react';
import {useNavigate , useParams} from 'react-router-dom'
import Header from './header' 
import ProfileContent from './profileContent'
import {UserContext } from '../userContext' 
import ExtraFeed from './extraFeed';
import axios from 'axios'

const Profile = () => {
	const navigate = useNavigate() 
	const {id} = useParams() 
  const [width, setWidth] = useState(window.innerWidth);
  const [user , setUser] = useState(null) 

  console.log({id})

  const getUser = async () => {
  try {
    const userResponse = await axios.get(`/user/${id}`, { withCredentials: true });
    console.log({ userResponse });
    if (userResponse?.data) {
      console.log({ username: userResponse?.data.user.name });
      setUser(prevUser => {
        return userResponse.data.user;
      });
    }
  } catch (error) {
    console.log({ error: error.message });
    alert(error.response.data.msg);
  }
};


console.log({user})


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
  	getUser()
  },[id])

  return (
    <div className="px-4">
    {/*This is for mobile screens here only one component is shown*/}
	    {width < 850 && (
	    	<div className="p-2 overflow-auto">
	    		<Header user={user}/> 
	    		<ProfileContent user={user} />
	    	</div>
	    )}

	    { width < 1200 && width >= 850 && (
	    	<div className="flex gap-2 px-2">
	    		<div className="w-[66%] overflow-auto">
	    			<Header user={user}/> 
	    			<ProfileContent user={user}/> 
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

	    		<div className="w-[50%]">
	    			<Header user={user}/> 
	    			<ProfileContent user={user}/> 
	    		</div>

	    		<div className="w-[27%] 2xl:w-[24%]">
	    			<ExtraFeed />
	    		</div>
	    	</div>
	    )}
    </div>
  );
};

export default Profile;
