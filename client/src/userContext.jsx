import React, { createContext, useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
export const UserContext = createContext({})

export function UserContextProvider({ children }) {

    const [profile, setProfile] = useState(null)
    const [allConnections , setAllConnections] = useState(false)
    const [posts, setPosts] = useState([])
    const [postIndex, setPostIndex] = useState(-1)
    const [currPost , setCurrPost] = useState(null)

    const get_user = async () => {
        try {
            const response = await axios.get('/user/profile', { withCredentials: true })
            console.log(response.data.user)
            setProfile(response.data.user)
        } catch (error) {
            // alert(error.response.data.msg)
        }
    }
    const getPosts = async () => {
        try {

            const response = await axios.get('/post/allPosts', { withCredentials: true })
            if (response ?.data ?.success) {
                setPosts(response ?.data ?.posts)
            }
            // console.log({ response })
        } catch (error) {
            // alert(error.response.data.msg)
        }
    }
    useEffect(() => {
        get_user()
        getPosts()
    }, [])

    

    return ( < >

        <UserContext.Provider 
             value = {{profile , setProfile, 
                        allConnections, setAllConnections,
                        posts , setPosts , 
                        setPostIndex, postIndex ,
                        currPost , setCurrPost
                        }} > {children}
              </UserContext.Provider> <
        />)
    }