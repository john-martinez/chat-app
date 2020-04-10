import React, { useEffect, useRef } from 'react';
import Navbar from '../Navbar/Navbar';
import './Chatroom.scss';

export default function Chatroom({messages, testDataFlow, channel, displayChannels}){
  const messagesContainer = useRef();
  useEffect(()=>{
    let container = messagesContainer.current.children;
    let lastMsg = container[container.length-1];
    if (lastMsg) lastMsg.scrollIntoView();
  }, [messages])
  return(
    <div className="chat-room">
      <Navbar channel={channel} displayChannels={displayChannels} />
      <div className="chat-room__messages" ref={messagesContainer}>
        {
          messages && 
          messages.map((val,i) => (
          <div className="chat-room__message" key={i}>
            {val[1].sender.split('@')[0] + ': '+val[1].message}
          </div>
          ))
        }
      </div>
      <form onSubmit={testDataFlow} className="chat-room__input-container">
        <label htmlFor="message"></label>
        <input className="chat-room__field" type="text" name="message" />
        <button>SEND</button>
      </form>
    </div>
  );
}