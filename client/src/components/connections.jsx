import React, {useState , useContext , useEffect} from 'react' 
import {NavLink, useNavigate} from 'react-router-dom'  
import {UserContext} from '../userContext'  
import axios from 'axios'
import Image from './images'

const Connections = ({profile}) => {
	const [currUser , setCurrUser] = useState(profile)
	const navigate = useNavigate() 
	const {setProfile , allConnections ,setAllConnections} = useContext(UserContext)

	const getUserConnections = async() => {
		try{
			const response = await axios.get('/user/userConnections',{withCredentials:true}) 
			if(response?.data){
				setCurrUser(response.data.user) ;
			}
		}catch(error){
			console.log({message:error.message})
			navigate('/home/feed')
		}
	}
useEffect(() => {
	if(allConnections === true) getUserConnections();
},[allConnections])

console.log({profile})

if(profile?.connections?.length>0) return (<> 

	{!allConnections && (<>
		<div className="p-2 flex justify-between items-baseline mt-2 overflow-y-auto">
			<span className="text-lg font-semibold">Connections</span>
			<button onClick = {(e) => {
				setAllConnections(true)
				navigate('/home/connections')
			}}
				className="border px-3 rounded-lg text-sm py-0.5 hover:text-slate-700 hover:font-semibold">
				View All
			</button>
		</div>
		{profile?.connections.slice(0,Math.min(4,profile?.connections?.length)).map((connection , index) => (
			<div className="p-1 rounded-xl border m-2 flex flex-col gap-3 justify-between">
				<NavLink title="View User Profile" to={`/profile/${connection?._id}`}
					 className="flex gap-2 justify-start py-1 px-4">
					<Image src={connection?.profileImage}
						className="h-12 w-12 object-cover rounded-full" 
						alt=""/>
					<div className="flex flex-col justify-center">
						<span className="text-sm font-semibold">{connection?.name}</span>
						<span className="text-xs">@{connection?.username}</span>
					</div>
				</NavLink>
				<div className="flex justify-center gap-4">
					<button title={`Chat with ${connection?.name?.split(' ')[0]}`} className="flex gap-2 py-1 items-center text-cyan-700 hover:border shadow-sm px-4 text-sm py-0.5 rounded-lg"
						>Message
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
						  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
						</svg>
					</button>

					<NavLink title="View user profile" to = {`/profile/${connection?._id}`}
						className="hover:border shadow-sm text-cyan-700 shadow-sm px-4 text-sm py-0.5 rounded-lg"
						>Visit Profile
					</NavLink>
				</div>
			</div>
		))}
	</>)}

	{allConnections && (<> 
		<div className="px-1 py-2 flex flex-col">
			<button onClick={(e) => {
				setAllConnections(false) 
				navigate('/home/feed')
			}}
				className="flex items-center gap-3 text-sm px-1 -ml-1 font-semibold mb-2">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
				  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
				</svg>
				Back to feed
			</button>
			<span className="text-xl font-semibold mt-1">Connections</span>
		</div>
		<div>
			{currUser?.connections.map((connection , index) => (<>
				<div className="p-2 rounded-xl border m-1 flex gap-4 justify-between items-center">
					<NavLink title="View User Profile" to={`/profile/${connection?._id}`}
						 className="flex gap-2 justify-center py-1">
						<Image path={connection?.profileImage}
							className="h-16 w-16 object-cover rounded-full" 
							alt=""/>
						<div className="flex flex-col justify-center">
							<span className="text-sm font-semibold">{connection?.name}</span>
							<span className="text-xs">@{connection?.username}</span>
						</div>
					</NavLink>
					<div className="flex flex-col items-end">
						<div className="flex px-4">
							{connection.connections.slice(0,Math.min(connection?.connections?.length,4)).map((user,index) => (<>
							<NavLink to={`/profile/${user?._id}`} className="-ml-2">
								<Image path={user?.profileImage}
									className="h-14 w-14 object-cover rounded-full" 
									alt=""/>
							</NavLink>
							</>))}
						</div>	
						<span className="text-sm px-3 flex ">{connection?.connections?.length} Connection(s)</span>
					</div>
				</div>
				
			</>))}
		</div>
	</>)}

	</>)
}

export default Connections 