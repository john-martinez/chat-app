import React, { useState, useEffect, useRef } from 'react';
import Chatroom from '../../components/Chatroom/Chatroom';
import BurgerDrawer from '../../components/BurgerDrawer/BurgerDrawer';
import firebase from 'firebase/app';
import 'firebase/firebase-auth';
import 'firebase/firebase-database';
import '../FormPage/FormPage.scss';
import './MainPage.scss';

export default function MainPage(props){
  const [user, setUser] = useState('');
  const [channelsList, setChannelsList] = useState(null);
  const [currentChannel, setcurrentChannel] = useState('General');
  const [messageList, setMessageList] = useState(null);
  let channelsDrawer = useRef();
  let channelsDrawerHeader = useRef();
  let auth = firebase.auth();
  let channels = firebase.database().ref().child('channels');

  function onAuthStateChange(){
        return  auth.onAuthStateChanged(cred=>{ 

        // retrieves list of channels
        channels.once('value', snap=>{
          console.log("NO")
         if (!channelsList) setChannelsList(snap.val()) 
        })

        // redirect when user is not signed in
        if (cred) setUser(cred.email)
        else props.history.push('/login')
    })
  }

  useEffect(()=>{
    channels.once('value', snap=>{
      let chatrooms = Object.entries(snap.val());
      let chatroom = chatrooms.find(item=>item[1].name === currentChannel);
      let messages = Object.entries(chatroom[1].messages);
      setMessageList(messages);
    }).then(()=>channels.off('value'));
  }, [currentChannel])

  useEffect(()=>{
    const unsubscribe = onAuthStateChange();
    return ()=>{
      unsubscribe();
    }
  }, [])


  const displayChannels = () => {
    channelsDrawer.current.classList.toggle('burger-drawer--visible');
    channelsDrawerHeader.current.classList.toggle('burger-drawer__header--visible');
  }
  const enterRoom = (e)=> {
    channelsDrawer.current.classList.remove('burger-drawer--visible');
    channelsDrawerHeader.current.classList.remove('burger-drawer__header--visible');
    setcurrentChannel(e.target.textContent.split("#")[1]);
  }
  const signOut = () => auth.signOut()
  const createRoom = (e) => {
    const {text, password} = e.target;
    channels.push().set({
      name: `${text.value}`,
      password:`${password.value}`,
      users: [user],
      messages: [{message: 'Hello, welcome to the new chatroom!', sender: 'default'}]
    });
    e.target.reset();
  }
  
  const testDataFlow = (e)=>{
    e.preventDefault();
    const {message} = e.target;
    let test = Object.entries(channelsList).find(val => val[1].name === currentChannel);
    let messageObj = {
      message: message.value, 
      sender: user,
      timestamp: Date.now()
    }

    firebase.database().ref('channels/' + test[0]).child('messages').push(messageObj);
    firebase.database().ref('channels/' + test[0]).child('messages').once('value', snap=> {
      console.log('85');
      let messageHistory = Object.entries(snap.val());
      setMessageList(messageHistory);
    })
    e.target.reset();
  }

  return(<>
    <div className="main-page">
      {user 
        ? (<>
          <BurgerDrawer channelsList={channelsList} enterRoom={enterRoom} ref={{channelsDrawer, channelsDrawerHeader}} />
          <Chatroom messages={messageList} testDataFlow={testDataFlow} channel={currentChannel} displayChannels={displayChannels}/>
        </>)
        : <h1>LOADING...</h1>
      }
    </div>
  </>);
}