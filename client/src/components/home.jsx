import React, { useState, useEffect , useContext} from 'react';
import {useParams , NavLink , useLocation } from 'react-router-dom'
// import UserProfile from './UserProfile';
import Feed from './feed';
import ExtraFeed from './extraFeed';
import Connections from './connections'
import Messages from './messages'
import {UserContext } from '../userContext'
import Image from './images'

const Home = () => {
	const location = useLocation() 
	const cPath = location.pathname ; 
	console.log({cPath})
	const {profile , allConnections , setAllConnections} = useContext(UserContext)
	const {path} = useParams() 
  const [width, setWidth] = useState(window.innerWidth);
  if(path==='connections')setAllConnections(true)
  else if(path !== 'connections') setAllConnections(false) ; 
	
	console.log({allConnections})
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  console.log({path,allConnections})

  return (
    <div className="">
    {/*This is for mobile screens here only one component is shown*/}
	    {width < 750 && (
	    	<div className="">
	    		{(cPath === '/' || cpath === '/home/feed') && <Feed /> }
	    		{path==='connections' && <Connections profile={profile}/> }
	    		{path==='messages' && <Messages/> }
	    	</div>
	    )}

	    { width < 1200 && width >= 750 && (
	    	<div className="flex gap-2 px-2">
	    		<div className={`${path==='messages'?'w-[65%]':'w-[60%]'} overflow-y-auto`}>
	    			{(path==='feed' || cPath === '/') && <Feed /> }
		    		{path==='connections' && <Connections profile={profile}/> }
		    		{path==='messages' && <Messages/> }
	    		</div>
	    		<div className="w-[40%] xl:w-[35%]">
	    			<ExtraFeed /> 
	    		</div>
	    	</div>
	    )}

	    {width >= 1200 && (
	    	<div className="flex gap-4 px-16">
	    		<div className="w-[13%]">
	    			
	    		</div>

	    		<div className="w-[50%]">
	    			{(path==='feed' || cPath === '/') && <Feed /> }
		    		{path==='connections' && <Connections profile={profile}/> }
		    		{path==='messages' && <Messages/> }
	    		</div>

	    		<div className="w-[27%] 2xl:w-[24%]">
	    			<ExtraFeed />
	    		</div>
	    	</div>
	    )}
    </div>
  );
};

export default Home;
