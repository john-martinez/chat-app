import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCompressAlt } from '@fortawesome/free-solid-svg-icons'
import Navbar from '../Navbar/Navbar';
import firebase from 'firebase/app';
import 'firebase/firebase-database';
import './Chatroom.scss';

const Chatroom = React.forwardRef(({ user, channel, displayChannels},ref) => {
  const messagesContainer = useRef();
  const prevChannel = useRef();
  const messageForm = useRef();
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
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

  const sendMessage = messageForm =>{
    let { message } = messageForm.current;
    let messageObj = {
      message: message.value, 
      sender: user,
      timestamp: Date.now()
    }
    messages.push(messageObj);
    setText(''); // clears the input field 
  }

  const onChangeHandler = e => { 
    setText(e.target.value);
  }
  
  const onKeypressHandler = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      sendMessage(messageForm);
    }
  }
  return(
    <div className="chat-room" ref={ref}>
      <Navbar channel={channel} displayChannels={displayChannels} />
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
      <form onSubmit={sendMessage} className="chat-room__input-container" ref={messageForm}>
        <div className="chat-room__field-container">
          <label htmlFor="message"></label>
          <div className="chat-room__field-target">{text}</div>
          <textarea 
            className="chat-room__field" 
            value={text} 
            onChange={onChangeHandler} 
            onKeyPress={onKeypressHandler}
            type="text" 
            name="message" 
            placeholder={`Message #${channel[1].name}`} ></textarea>
        </div>
        <div className="chat-room__field-icon"><FontAwesomeIcon icon={faCompressAlt} /></div>
      </form>
    </div>
  );
});

export default Chatroom;