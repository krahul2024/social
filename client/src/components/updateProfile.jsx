import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../userContext';
import { useNavigate , NavLink } from 'react-router-dom'

const UpdateProfile = () => {

  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const { profile, setProfile } = useContext(UserContext)

  const handleTogglePassword = () => {
      setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const [user, setUser] = useState({
      username: profile ?.username,
      name: profile ?.name,
      location: profile ?.location,
      status: profile ?.status,
      email: profile ?.email,
      phone: profile ?.phone
  })

  const handleInputs = (e) => {
      const name = e.target.name,
          value = e.target.value
      setUser({ ...user, [name]: value })
  }

  const updateProfile = async (e) => {
      e.preventDefault()
      // console.log({user})

      try {
          const updatedUser = { ...profile, ...user }
          console.log({ updatedUser })
          
          const updateResponse = await axios.post('/user/update', {
              user: updatedUser
          }, {
              withCredentials: true
          })

          if (updateResponse ?.data ?.success) {
              setProfile(updateResponse.data.user)
              navigate(`/profile/${profile?._id}`)
          }

      } catch (error) {
          console.log({ error: error.message })
          alert(error ?.response ?.data ?.msg)
      }
  }

        // console.log({profile})

  const getInputField = (name, value, label, type, disable = false) => {
    return (
      <div>
        <label htmlFor="text" className="block font-medium mb-1">
          {label}
        </label>
        {disable ? (
          <input
            disabled
            type={type}
            value={value}
            name={name}
            className="w-full bg-transparent border-b border-gray-400 px-4 py-1 outline-0 hover:border-sky-700 text-cyan-700"
          />
        ) : (
          <input
            type={type}
            value={value}
            name={name}
            onChange={(e) => handleInputs(e)}
            className="w-full bg-transparent border-b border-gray-400 px-4 py-1 outline-0 hover:border-sky-700 text-cyan-700"
          />
        )}
      </div>
    );
  };


  if(profile) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="max-w-md w-full mx-auto px-16 py-20 shadow-xl rounded-xl my-40">
        <div className="mb-28 lg:mb-36 px-2">
            <h2 className="text-2xl font-bold text-center mb-2">Update Profile Details</h2>
        </div>

        <form className="space-y-5" onSubmit={updateProfile}>
             {getInputField('username' , user.username , 'Username' , 'text' , true)}
             {getInputField('name' , user.name , 'Name' , 'text')}
             {getInputField('email' , user.email , 'Email' , 'email')}
             {getInputField('phone' , user.phone , 'Phone' , 'text')}
             {getInputField('location' , user.location , 'Location' , 'text')} 
             {getInputField('status' , user.status , 'Status' , 'text')}

          <div className="flex gap-3 justify-center px-1">
            <button
              type="submit"
              className="bg-sky-700 text-gray-200 w-full py-1 mt-4 -mb-3 rounded-xl hover:bg-cyan-800 shadow-lg"
            >
              Update Profile
            </button>
            <NavLink to = {`/profile/${profile._id}`}
              className="bg-sky-700 flex justify-center text-gray-200 w-full py-1 mt-4 -mb-3 rounded-xl hover:bg-cyan-800 shadow-lg"
              > Cancel
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  ); 
 else navigate('/auth')
};

export default UpdateProfile;
