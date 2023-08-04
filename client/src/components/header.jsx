import React, {useState , useEffect , useContext} from 'react' 
import {NavLink , useNavigate} from 'react-router-dom' 
import {UserContext} from '../userContext'
import axios from 'axios'
import Image from './images'


const Header = ({user}) => {
  const navigate = useNavigate() 
  const {profile , setProfile } = useContext(UserContext)  
  const profilePic = user?.profileImage , coverPic = user?.coverImage ;

  const isSame = profile?.username === user?.username 
  const [profileImage ,setProfileImage] = useState({}); 
  const [coverImage , setCoverImage] = useState({}) ; 

  const handleImage = async (e , type ) => {
    e.preventDefault() ;
    const image = e.target?.files[0] ,
     preview = URL.createObjectURL(image) 
     console.log({type})
    if(type === 'profile' ) setProfileImage({image , preview}); 
    else if(type === 'cover') setCoverImage({image , preview});
  }
  console.log({profile})

  const cancelChange = async (e , type) => {
    e.preventDefault() ; 
    if(type === 'profile' ) setProfileImage({}); 
    else if(type === 'cover') setCoverImage({});
  }

  const uploadImage = async (e,type) => {
    e.preventDefault() ; 
    try{
      const data = new FormData() ; 
      if(type === 'profile') data.append('photos' , profileImage.image);
      else if(type === 'cover') data.append('photos' , coverImage.image); 

      const response = await axios.post('/images/upload', data , { withCredentials:true }); 
      if(response?.data) {
        const imagePath = response.data.images[0] 
        let updatedUser = user 
        if(type === 'profile')updatedUser.profileImage = imagePath // updated profile image 
        else if(type === 'cover') updatedUser.coverImage = imagePath 
        const uploadResponse = await axios.post('/user/update' , {
          user:updatedUser 
        },{withCredentials:true}) ; 

        if(uploadResponse?.data){
          setProfile(uploadResponse.data.user) ; 
          if(type === 'profile' ) setProfileImage({}); 
          else if(type === 'cover') setCoverImage({})
        }
      }

    }
    catch(error){
      console.log({message:error.message})
      if(type === 'profile') setProfileImage({}) ; 
      else if(type === 'cover') setCoverImage({});
    }
  }


  return (<> 

      <div className="p-1 mb-24">
        <div className="p-1 relative flex">
            <div className="relative w-full">
              <Image path={coverImage?.image?coverImage.preview:coverPic} 
                className="w-full object-cover h-52 rounded-md"
                alt=""/>
              {isSame && ( 
                <label onChange={ (e) => handleImage(e,'cover') }
                  htmlFor="coverFileInput" className="cursor-pointer absolute mx-0.5 bottom-0 hover:opacity-100 right-[0%] bg-white rounded-2xl">
                  <input type="file" accept="image/*" id="coverFileInput" className="hidden" />
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0c4a6e" className="w-6 h-6">
                    <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
                    <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                  </svg>
                </label> 
              )}

              {isSame && coverImage?.image && (
                      <div className="absolute flex gap-1.5  mx-auto mb-1 text-sm -bottom-0 right-8">
                        <button onClick = {(e) => cancelChange(e,'cover') }
                          className="shadow-md bg-sky-900 text-white rounded-md px-2">Cancel</button>
                        <button onClick={(e) => uploadImage(e,'cover')}
                          className="shadow-md bg-sky-900 text-white rounded-md px-2">Confirm</button>
                      </div>
                )}
            </div>
            

              <div className="absolute bottom-0 translate-y-[70%] translate-x-[8%] flex gap-4 justify-between">
                <div className="flex">
                  <Image path={profileImage?.image ? profileImage.preview : profilePic} 
                    className="w-32 h-32 object-cover rounded-full border-4 border-white"
                    alt=""/>

                  {isSame && ( 
                    <label onChange = { (e) => handleImage(e,'profile') }
                       htmlFor="profileFileInput" className="cursor-pointer absolute mb-0.5 -mx-1 bottom-0 hover:opacity-100 right-[60%] bg-white rounded-2xl">
                      <input type="file" accept="image/*" id="profileFileInput" className="hidden" />
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0c4a6e" className="w-6 h-6">
                        <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
                        <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                      </svg>
                    </label>
                  )}{isSame && profileImage?.image && (
                      <div className="absolute flex gap-1.5  mx-auto mb-1 text-sm -bottom-7">
                        <button onClick = {(e) => cancelChange(e,'profile') }
                          className="shadow-md bg-sky-900 text-white rounded-md px-2 py-0.5 ">Cancel</button>
                        <button onClick={(e) => uploadImage(e,'profile')}
                          className="shadow-md bg-sky-900 text-white rounded-md px-2 py-0.5 ">Confirm</button>
                      </div>
                  )}
                </div>
                <div className="translate-y-[30%] flex flex-col -ml-2">
                  <span className="text-lg font-semibold">{user?.name}</span>
                  <span className="opacity-90 text-xs font-semibold -mt-1">@{user?.username}</span>
                </div>
              </div>

              
              {/*This section is for edit profile, add connection and message */}
               <div className="flex gap-6 absolute py-6 right-6 -bottom-4 translate-y-[60%] opacity-90">
                  {!isSame && (<>
                    {profile?.connections.find(conn => conn?.username === user?.username) ? (
                      <button title={`${user?.name} is connection.`}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0e7490" className="w-6 h-6">
                        <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                      </svg>
                      </button>
                      ):(<button title="Add Connection?">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0e7490" className="w-7 h-7">
                        <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z" />
                      </svg>
                    </button>)}
                     <button title="Start chat?" className="">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0e7490" className="w-7 h-7">
                        <path fillRule="evenodd" d="M5.337 21.718a6.707 6.707 0 01-.533-.074.75.75 0 01-.44-1.223 3.73 3.73 0 00.814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 01-4.246.997z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </>)}
                  {isSame && (<> 
                      <NavLink title="Update profile details" to="/update-profile"
                        className="rounded-md p-1.5 mt-2 hover:font-semibold text-xs shadow-sm shadow-gray-100 text-gray-100"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#164e63" className="w-7 h-7">
                          <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                          <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                        </svg>
                      </NavLink>
                  </>)}
                </div>

            </div>
          </div>


    </>)
}

export default Header ; 