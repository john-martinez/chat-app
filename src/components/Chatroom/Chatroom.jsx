import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCompressAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons'
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
    if (message.value.trim().length){
      let messageObj = {
        message: message.value.trim(), 
        sender: user,
        timestamp: Date.now()
      }
      messages.push(messageObj);
    } 
  }

  const onKeypressHandler = e => {
    if (e.key === 'Enter') {
      if (!e.shiftKey){
        sendMessage(messageForm);
        setText(''); // clears the input field 
      }
    }
  }

  const onChangeHandler = e => {
    const message = e.target.value;
    const isMessageAWhitespace = message.trim().length === 0;
    setText(isMessageAWhitespace ? '' : message);
  }
  const retrieveDate = (timestamp) => {
    let date = new Date(timestamp) + ''; // convert date object to string
    return date.split(' ').slice(1,4).join(' ');
  }

  const retrieveTime = (timestamp) => {
    const date = new Date(timestamp) + ''; // convert date object to string
    const time = date.split(' ')[4].split(':').slice(0,2);
    let hours = parseInt(time[0]);
    let minutes = time[1];
    const isAfternoon = hours > 12;
    if (isAfternoon) 
      hours = hours - 12;
    return `${hours < 10 ? '0'+hours : hours}:${minutes} ${isAfternoon ? 'PM' : 'AM'}`
  }

  const renderMessage = () => {
    let currUser = firebase.auth().currentUser;
    let { photoURL, displayName } = currUser;
    const userHasPhoto = currUser && currUser.photoURL;
    const userHasDisplayName = currUser && currUser.displayName; 
    console.log(currUser && currUser.photoURL);
    return msgs.length && 
    msgs.map((val,index) => {
      const previousMessage = msgs[index-1];
      const isSameUser =  index && previousMessage.sender === val.sender;

      // checks if message was sent within 5 mintues from the last time the last message was sent
      const isWithinFiveMinutes = index && (val.timestamp - previousMessage.timestamp <= 60000);
      
      if (isSameUser && isWithinFiveMinutes){
        return (
          <div className="chat-room__message chat-room__message--same-user" key={index}>
            <div className="chat-room__message--left">
            <span className="chat-room__message-timestamp">{retrieveTime(val.timestamp)}</span>
            </div>
            <div className="chat-room__message--right">
              <div className="chat-room__message-blurb">
                  {val.message}
              </div>
            </div>
          </div>
        )
      } else {
        return (
          <div className={`chat-room__message ${isSameUser ? 'chat-room__message--margin-bottom' : ''}`} key={index}>
            <div className="chat-room__message--left">
              { userHasPhoto
                ? <div className="chat-room__message-pic">
                    <img src={photoURL} alt="user picture"/>
                  </div>

                : <span className="chat-room__message-pic-icon">
                    <FontAwesomeIcon icon={faUserCircle} />
                  </span>
              }         
            </div>
            <div className="chat-room__message--right">
              <div className="chat-room__message-header">
                <span className="chat-room__message-sender">
                  { userHasDisplayName 
                    ? displayName
                    : val.sender.split('@')[0]
                  } </span>
                <span className="chat-room__message-timestamp chat-room__message-timestamp--visible">{retrieveDate(val.timestamp)}</span>
              </div>
              <div className="chat-room__message-blurb">
                {val.message}
              </div>
            </div>
          </div>
        )
      }
    })
  }

  return(
    <div className="chat-room" ref={ref}>
      <Navbar channel={channel} displayChannels={displayChannels} />
      <div className="chat-room__messages" ref={messagesContainer} onClick={(e)=>displayChannels(true)}>
        { renderMessage() }
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