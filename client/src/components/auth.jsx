import React, { useState , useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import {UserContext} from '../userContext'
import axios from 'axios'

const Auth = () => {
  const navigate = useNavigate()
  const [isRegistered, setIsRegistered] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const {profile , setProfile} = useContext(UserContext) 
  const [name , setName] = useState('')
  const [username , setUsername] = useState('') 
  const [password , setPassword] = useState('')

  const toggleForm = () => {
      setIsRegistered((prevIsRegistered) => !prevIsRegistered);
  };

  const handleLoginSubmit = async (e) => {
      e.preventDefault();
      // console.log({username , password})
      try {

          const response = await axios.post('/auth/login', {
              username,
              password
          }, { withCredentials: true })

          if(response?.data?.success){
            setProfile(response.data.user) 
            // localStorage.setItem('accessCookie',response.data.user.token); // setting the token when logged in 
            navigate('/home/feed')
         }

      } catch (error) {
          console.log(error)
          alert(error.response.data.msg) 
      }
  };

  const handleRegisterSubmit = async (e) => {
      e.preventDefault();
      // console.log({name , username , password})
      try {

          const response = await axios.post('/auth/register', {
              username,
              password ,  
              name 
          }, { withCredentials: true })

          console.log( response.data )
          alert(response.data.msg)
          setIsRegistered(true) 

      } catch (error) {
          console.log(error) 
          alert(error.response.data.msg) 
      }
  };

  const handleTogglePassword = () => {
      setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  if(!profile) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="max-w-md w-full mx-auto px-16 py-20 shadow-xl rounded-xl my-40">
      	<div className="mb-28 lg:mb-36 px-2">
        {isRegistered ? (
          <>
            <h2 className="text-3xl font-bold text-center mb-2">Welcome Back!</h2>
            <p className="text-gray-500 text-center mb-6 text-sm">
              log in to see what's going on!
            </p>
            </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center mb-2">Sign Up</h2>
            <p className="text-gray-500 text-center mb-6 text-sm">
              sign up to share and connect with people around you
            </p>
          </>
        )}
        </div>

        <form
          className="space-y-5"
          onSubmit={isRegistered ? handleLoginSubmit : handleRegisterSubmit}
        >
        {!isRegistered && (
        	 <div>
            <label htmlFor="text" className="block font-medium mb-1">
              Your Name
            </label>
            <input
              type="text" onChange = {(e) => setName(e.target.value) } value = {name}
              className="w-full bg-transparent border-b border-gray-400 px-4 py-1 outline-0 hover:border-sky-700 text-cyan-700"
              required
            />
          </div>
        )}
          <div>
            <label htmlFor="text" className="block font-medium mb-1">
              Username
            </label>
            <input
              type="text" onChange = {(e) => setUsername(e.target.value) } value = {username}
              className="w-full bg-transparent border-b border-gray-400 px-4 py-1 outline-0 hover:border-sky-700 text-cyan-700"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'} onChange = {(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-gray-400 px-4 py-1 outline-0 hover:border-sky-700 text-cyan-700"
                value={password}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-sky-700"
                onClick={handleTogglePassword}
              >
                <div className="-mt-1 outline-0">
                  {showPassword ? (
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-5">
          					  <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
          					  <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
          					  <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
          					</svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-5">
          					  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
          					  <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
          					</svg>
                  )}
                </div>
              </button>
            </div>
          </div>
          <div className="flex justify-center px-1">
            <button
              type="submit"
              className="bg-sky-700 text-gray-200 w-full py-1 mt-4 -mb-3 rounded-full hover:bg-cyan-800 shadow-lg"
            >
              {isRegistered ? 'Login ' : ' Register'}
            </button>
          </div>

          <p className="text-center">
            {isRegistered ? 'Not registered yet? ' : 'Already registered? '}
            <button
              type="button"
              className="text-cyan-700 ml-1 hover:text-cyan-900"
              onClick={toggleForm}
            > 	
             	 {isRegistered ? ' Register' : ' Login'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
  
  else navigate('/home/feed')
};

export default Auth;
