import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import firebase from 'firebase/app';
import 'firebase/firebase-database';
import './Chatroom.scss';

const Chatroom = React.forwardRef(({ user, channel, displayChannels, signOut, editProfile},ref) => {
  const messagesContainer = useRef();
  const prevChannel = useRef();
  const [msgs, setMsgs] = useState([]);
  const messages = firebase.database().ref('channels/' + channel[0]).child('messages');

  useEffect(()=>{
    // initial message load
    const msgsList = [];
    messages.on('child_added', snap=>{
      msgsList.push(snap.val());
    })
    setMsgs(msgsList.slice());    
  }, [channel])

  useEffect(()=>{
    
    if (msgs.length && prevChannel.current === channel){
      messages.limitToLast(1).on('child_added', snap=>{
        if (snap.val().timestamp !== msgs[msgs.length-1].timestamp) setMsgs([...msgs, snap.val()])
      })
    }
    prevChannel.current = channel;
  })

  useEffect(()=>{
    let container = messagesContainer.current.children;
    let lastMsg = container[container.length-1];
    if (lastMsg) lastMsg.scrollIntoView();
  })

  const sendMessage = e=>{
    e.preventDefault();
    const {message} = e.target;
    let messageObj = {
      message: message.value, 
      sender: user,
      timestamp: Date.now()
    }
    messages.push(messageObj);
    e.target.reset();
  }

  return(
    <div className="chat-room" ref={ref}>
      <Navbar channel={channel} displayChannels={displayChannels} user={user} editProfile={editProfile} signOut={signOut}/>
      <div className="chat-room__messages" ref={messagesContainer} onClick={(e)=>displayChannels(true)}>
        {
          msgs.length && 
          msgs.map((val,i) => (
          <div className="chat-room__message" key={i}>
            {val.sender.split('@')[0] + ': '+val.message}
          </div>
          ))
        }
      </div>
      <form onSubmit={sendMessage} className="chat-room__input-container">
        <label htmlFor="message"></label>
        <input className="chat-room__field" type="text" name="message" />
        <button className="chat-room__button">SEND</button>
      </form>
    </div>
  );
});

export default Chatroom;