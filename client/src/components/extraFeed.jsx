import React, { useEffect, useState ,useContext } from 'react'
import p1 from '../images/image-1.jpg'
import {UserContext } from '../userContext'
import Connections from './connections'
import Suggestions from './suggestions'

const ExtraFeed = () => {
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const {profile , setProfile ,allConnections , setAllConnections } = useContext(UserContext) 

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      setIsMobileScreen(isMobile);
    };

    handleResize(); // Check on component mount

    window.addEventListener('resize', handleResize); // Listen for resize events

    return () => {
      window.removeEventListener('resize', handleResize); // Clean up the event listener
    };
  }, []);

  const sendMessage = (connectionId) => {
    console.log(`Sending message to connection ${connectionId}`);
  };

  const removeConnection = (connectionId) => {
    setConnections((prevConnections) =>
      prevConnections.filter((connection) => connection.id !== connectionId)
    );
  };

  const viewProfile = (connectionId) => {
    console.log(`Viewing profile of connection ${connectionId}`);
  };

  return (<> 
    <div className="overflow-auto">
      <Suggestions profile = {profile} /> 
    </div>
    
  </>);
};

export default ExtraFeed;
