import React, {useState , useContext , useEffect} from 'react' 
import {NavLink} from 'react-router-dom'  
import {UserContext} from '../userContext'  
import axios from 'axios'
import Image from './images'

const Suggestions = ({ profile }) => {

    const { setProfile } = useContext(UserContext)
    const [suggestions, setSuggestions] = useState([])
    const [sent, setSent] = useState([])
    const [accepted , setAccepted] = useState([])
    const [rejected , setRejected] = useState([]) 

    const getSuggestions = async () => {
        // console.log({ id: profile ?._id })

        try {
            const suggestionResponse = await axios.post('/user/suggestions', {
                id: profile ?._id
            }, { withCredentials: true })
            // console.log({ Response: suggestionResponse ?.data ?.suggestions })
            setSuggestions(suggestionResponse ?.data ?.suggestions)

        } catch (error) {
            console.log({ message: error.message })
        }
    }
    useEffect(() => {
        getSuggestions()
    }, [])

    const addConnection = async (e, user, index) => {
        e.preventDefault()
        console.log('Request senHt to ', user.username)
        try {
            const requestResponse = await axios.get(`/user/requestConnection/${user?._id}`, {
                withCredentials: true
            })
            // console.log({ requestResponse })
            if (requestResponse ?.data) {
                const resp = requestResponse.data
                if (resp.success) {
                    setSent([...sent, resp.user.username])
                }
                setProfile(resp.profile)
            }
        } catch (error) {
            console.log({ message: error.message })
        }
    }

    const acceptConnection = async (e, user, index) => {
        e.preventDefault();
        console.log("connection accepted")
        try {
            const acceptedResponse = await axios.get(`/user/acceptConnection/${user._id}`, { withCredentials: true })
            if(acceptedResponse?.data){
            	const resp = acceptedResponse.data ; 
            	setProfile(resp.profile) ; 
            	console.log('Connection added')
            	setAccepted([...accepted , resp.user])
            }
        } catch (error) {
            console.log({ message: error ?.response ?.data ?.msg })
        }
    }

    const rejectConnection = async(e,user,index) => {
    	e.preventDefault() ; 
    	console.log('connection rejected')
    	try{
    		const rejectedResponse = await axios.get(`/user/rejectConnection/${user._id}`,{withCredentials:true }) 
    		if(rejectedResponse?.data){
            	const resp = rejectedResponse.data ; 
            	setProfile(resp.profile) ; 
            	console.log('Connection added')
            	setRejected([...rejected , resp.user])
            }
    	}
    	catch(error){
    		console.log({message:error?.response?.data?.msg})
    	}
    }
// console.log({rejected , accepted})

return (<> 

		<div className="p-1">
			<div className="px-2 py-3 text-lg font-semibold ">Suggestions</div>
			{Suggestions.length>0 && suggestions.map((suggestion , index) => (
				<div className="p-2 rounded-xl border m-1 flex gap-4 justify-between">
					<NavLink title="View User Profile" to={`/profile/${suggestion?._id}`}
						 className="flex gap-2 justify-center py-1">
						<Image path={suggestion?.profileImage}
							className="h-12 w-12 object-cover rounded-full" 
							alt=""/>
						<div className="flex flex-col justify-center">
							<span className="text-sm font-semibold">{suggestion?.name}</span>
							<span className="text-xs">@{suggestion?.username}</span>
						</div>
					</NavLink>
					<button onClick={(e) => addConnection(e,suggestion , index)}
						className="mr-1" title="Send Connection Request">
						{sent.includes(suggestion.username)? 
							(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
							  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>)
							 : 
							 (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
								  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
								</svg>)
						}

					</button>
				</div>
			))}
		</div>
		{profile?.receivedRequests?.length>0 && (
			<div className="p-2 mt-3">
			<span className="px-2 py-1 text-lg font-bold">Connection Requests</span>
			{profile.receivedRequests.map((requestUser , index) => (
			<div className="p-1 rounded-xl border m-2 flex flex-col gap-3 justify-between">
				<NavLink title="View User Profile" to={`/profile/${requestUser?._id}`}
					 className="flex gap-2 justify-start py-1 px-4">
					<Image path={requestUser?.profileImage}
						className="h-12 w-12 object-cover rounded-full" 
						alt=""/>
					<div className="flex flex-col justify-center">
						<span className="text-sm font-semibold">{requestUser?.name}</span>
						<span className="text-xs">@{requestUser?.username}</span>
					</div>
				</NavLink>
				<div className="flex justify-center gap-4">
					<button onClick = {(e) => acceptConnection(e,requestUser , index)}
						className="border border-gray-100 shadow-sm px-4 text-sm py-0.5 rounded-lg"
						>Accept</button>

					<button onClick = {(e) => rejectConnection(e,requestUser , index) }
						className="border border-gray-100 shadow-sm px-4 text-sm py-0.5 rounded-lg"
						>Reject</button>
				</div>
			</div>
			))}
			</div>
		)}
		{(accepted.length>0 || rejected.length>0) && (<div className="p-2">
							<span className="font-semibold">Actions</span>
						</div>)}
		{accepted && accepted.map((user , index) => (
			<div className="p-1 rounded-xl border m-2 flex flex-col gap-3 justify-between">
				<NavLink title="View User Profile" to={`/profile/${user?._id}`}
					 className="flex gap-2 justify-start py-1 px-4">
					<Image path={user?.profileImage}
						className="h-12 w-12 object-cover rounded-full" 
						alt=""/>
					<div className="flex flex-col justify-center">
						<span className="text-sm font-semibold">{user?.name}</span>
						<span className="text-xs">@{user?.username}</span>
					</div>
				</NavLink>
				<div className="flex justify-center gap-4">
					<span className="flex gap-2 py-1 items-center border border-gray-100 text-cyan-700 shadow-sm px-4 text-sm py-0.5 rounded-lg"
						> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#0e7490" className="w-4 h-4">
							  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
							</svg>
						Accepted</span>

					<NavLink title="View user profile" to = {`/profile/${user._id}`}
						className="border border-gray-100  text-cyan-700 shadow-sm px-4 text-sm py-0.5 rounded-lg"
						>Visit profile</NavLink>
				</div>
			</div>
			))}

			{rejected && rejected.map((user , index) => (
			<div className="p-1 rounded-xl border m-2 flex flex-col gap-3 justify-between">
				<NavLink title="View User Profile" to={`/profile/${user?._id}`}
					 className="flex gap-2 justify-start py-1 px-4">
					<Image path={user?.profileImage}
						className="h-12 w-12 object-cover rounded-full" 
						alt=""/>
					<div className="flex flex-col justify-center">
						<span className="text-sm font-semibold">{user?.name}</span>
						<span className="text-xs">@{user?.username}</span>
					</div>
				</NavLink>
				<div className="flex justify-center gap-4">
					<span className="flex gap-2 py-1 items-center border border-gray-100 text-red-700 shadow-sm px-4 text-sm py-0.5 rounded-lg"
						> 
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#b91c1c" className="w-4 h-4">
						  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						Rejected
					</span>
					<NavLink title="View user profile" to = {`/profile/${user._id}`}
						className="border border-gray-100  text-red-700 shadow-sm px-4 text-sm py-0.5 rounded-lg"
						>Visit profile
					</NavLink>
				</div>
			</div>
			))}
		
	</>)
}

export default Suggestions 