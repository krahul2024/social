import React , {useMemo , useEffect} from 'react';
import { Routes, Route } from 'react-router-dom';
import Auth from './components/auth' 
import Profile from './components/profile' 
import Navbar from './components/navbar'
import Home from './components/home'
import ImageForm from './components/imageForm'
import UpdateProfile from './components/updateProfile'
import PostPage from './components/postPage'
import './index.css'
import axios from 'axios'
import socketIO from 'socket.io-client'
import { UserContextProvider } from './userContext'
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

function App() {
  return (
    <>
      <UserContextProvider>
        <Navbar />
        <Routes>
          {/* Set the default route to /home/feed */}
          <Route path="/" element={<Home />} />

          {/* Define other routes */}
          <Route path="/home/:path" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/image" element={<ImageForm />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
        </Routes>
      </UserContextProvider>
    </>
  );
}



export default App;