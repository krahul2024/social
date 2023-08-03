import axios from 'axios';
import React, { useState, useContext, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../userContext';
import socketIO from 'socket.io-client';
import baseUrl from './baseUrl.js';
import Image from './images'

const Messages = () => {
  const navigate = useNavigate();
  const { profile, setProfile } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [allMessages, setAllMessages] = useState([]);
  const [message, setMessage] = useState('');
  const scrollRef = useRef(null); // this is for scrolling to the last message

  // establishing the connection with the server when this component is rendered
  useEffect(() => {
    const socket = socketIO.connect('http://localhost:5000');
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('response', (data) => {
        console.log('Received message:', data);
        // Identify received messages and add them to the state
        setAllMessages((prev) => [...prev, data]);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [allMessages]);

  const changeUser = async (e, conn) => {
    e.preventDefault();
    setUser(conn);
    try {
      const response = await axios.post(
        '/user/getMessages',
        {
          user: conn,
        },
        { withCredentials: true }
      );

      if (response?.data) {
        setAllMessages(response.data.messages);
        setProfile(response.data.profile);
      }
    } catch (error) {
      console.log({ error: error.message });
    }
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    setMessage(e.target.value);
  };

  const getTime = (val) => {
  	const presentYear = new Date().toString().split(' ')[3]; 
  	const time = new Date(val).toString().split(' '); 
  	const values = time[4].split(':')
  	return `${time[2]}-${time[1]}${time[3]==presentYear?'':'-'+time[3]} ${values[0]}:${values[1]}`; 
  }

  const handleSend = () => {
    // Implement logic to send the message
    const msg = {
      by: profile?._id.toString(),
      to: user?._id.toString(),
      text: message,
    };
    console.log('user:', user?.name, 'profile', profile?.name);
    console.log('Sending message:', msg);
    socket.emit('message', msg);
    setMessage('');
  };

  console.log('Total Messages : ', allMessages.length);

  return (
    <>
      <div className="flex rounded-lg h-screen">
        {/* User list section */}
        <div className="w-[30%] overflow-x-hidden shadow-md">
          {profile?.connections?.map((conn, index) => (
            <button
              key={index}
              onClick={(e) => changeUser(e, conn)}
              className={`flex w-full flex-col px-1 py-2 rounded-b-md border-b ${
                conn?.username === user?.username ? 'bg-gray-700' : ''
              }`}
            >
              <div className="flex gap-2 items-center">
                <Image
                  path={conn?.profileImage}
                  alt=""
                  className={`h-11 w-11 object-cover rounded-full${
                    conn?.username === user?.username ? ' border-2' : ''
                  }`}
                />
                <div className="flex flex-col items-start px-1">
                  <span
                    className={`text-sm font-semibold ${
                      user?.username === conn?.username ? 'text-gray-200' : ''
                    }`}
                  >
                    {conn?.name?.split(' ')[0]}
                  </span>
                  <span
                    className={`text-xs -mt-1 ${
                      user?.username === conn?.username ? 'text-gray-200' : ''
                    }`}
                  >
                    {Math.floor(Math.random() * 10) + 1} Mins ago
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Chat section */}
        {user && (
          <div className="flex flex-col w-[70%]">
            {/* Active user profile */}
              <div className="flex gap-4 items-center p-3 rounded-b-md bg-gray-700">
                <Image
                  path={user?.profileImage}
                  alt="User Profile"
                  className="h-12 w-12 rounded-full border-2 object-cover"
                />
                <div className="flex flex-col justify-center">
                  <span className="text-gray-200 font-semibold text-md">
                    {user?.name}
                  </span>
                  <span className="text-gray-200 -mt-1 text-xs opacity-80">
                    {Math.floor(Math.random() * 10) + 1} Mins ago
                  </span>
                </div>
            </div>
            {/* Message section */}
            <div className="flex-grow p-4 flex flex-col overflow-y-auto" style={{ maxHeight: 'calc(100vh - 5rem)' }}>
              {allMessages.length > 0 &&
                allMessages.map((msg, index) => (
                  <div
                    key={index}
                    className="text-sm backdrop-brightness-150"
                    ref={index === allMessages.length - 1 ? scrollRef : null}
                  >
                    {msg.by === user?._id ? (
                      <div className="flex justify-start">
                        <div className="flex flex-col bg-gray-700 px-3 py-2 my-1 text-gray-200 border rounded-3xl rounded-tl-none max-w-[50%] break-words">
                          <span className="text-white text-xs mb-1 opacity-60">{getTime(msg.createdAt)}</span>
                          {msg.text}
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <div className="flex flex-col bg-gray-300 px-3 py-2 my-1 text-gray-900 border rounded-3xl rounded-tr-none max-w-[50%] break-words">
                          <span className="text-gray-800 text-xs mb-1 opacity-60">{getTime(msg.createdAt)}</span>
                          {msg.text}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Input section */}
            <div className="flex bg-white border-gray-300 shadow-gray-200 shadow-xl items-center px-2 border rounded-lg">
              <button>
              	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
				  <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
				</svg>
              </button>		
              <textarea
                className="flex-grow resize-none h-12 rounded-lg px-4 py-2 bg-inherit text-gray-700 focus:outline-none"
                placeholder="Type a message..."
                value={message}
                onChange={handleInputChange}
              ></textarea>
              <button
                title="Send the message"
                className={`p-1 flex justify-center ${
                  message.length > 0 ? 'bg-cyan-500 shadow-lg' : 'bg-gray-200'
                } rounded-lg`}
                onClick={handleSend}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#0369a1"
                  className="w-6 h-6"
                >
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </div>
          </div>
        )}
        {!user && (
          <div className="w-[70%] shadow-lg flex items-center text-center justify-center">
            Select a connection to start a conversation.
          </div>
        )}
      </div>
    </>
  );
};

export default Messages;
