import React from 'react';
import './Chatroom.scss';

export default function Chatroom({messages, testDataFlow}){
  return(
    <div className="chat-room">
      <div className="chat-room__messages">
        {
          messages && 
          messages.map((val,i) => (
          <div key={i}>
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