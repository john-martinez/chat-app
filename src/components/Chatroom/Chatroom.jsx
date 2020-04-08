import React from 'react';
import Navbar from '../Navbar/Navbar';
import './Chatroom.scss';

export default function Chatroom({messages, testDataFlow, channel, displayChannels}){
  return(
    <div className="chat-room">
      <Navbar channel={channel} displayChannels={displayChannels} />
      <div className="chat-room__messages">
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