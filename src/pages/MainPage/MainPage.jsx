import React, { useState, useEffect, useRef } from 'react';
import Chatroom from '../../components/Chatroom/Chatroom';
import firebase from 'firebase/app';
import 'firebase/firebase-auth';
import 'firebase/firebase-database';
import '../FormPage/FormPage.scss';
import './MainPage.scss';

export default function MainPage(props){
  const [user, setUser] = useState('');
  const [channelsList, setChannelsList] = useState(null);
  const [visible, setVisible] = useState(false);
  const [currentChannel, setcurrentChannel] = useState('General');
  const [messageList, setMessageList] = useState(null);
  let auth = firebase.auth();
  let channels = firebase.database().ref().child('channels');
  let channelsDrawer = useRef();
  let channelsDrawerHeader = useRef();

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
      console.log('haha');
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
    channelsDrawer.current.classList.toggle('main-page__channel-drawer--visible');
    channelsDrawerHeader.current.classList.toggle('main-page__channel-drawer-header--visible');

  }
  const enterRoom = (e)=> {
    setcurrentChannel(e.target.textContent.split("#")[1]);
  }
  const visibility = () => setVisible(!visible);
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
        <div className="main-page__channel-drawer" ref={channelsDrawer}>
          <div className="main-page__channel-drawer-header" ref={channelsDrawerHeader}>
            <div className="main-page__channel-drawer-header--left">
              <div className="placeholder-pic"></div>
            </div>
            <div className="main-page__channel-drawer-header--right">
              <input className="main-page__channel-drawer-search" type="text" name="search-channels" />
            </div>
          </div>
          <div className="main-page__channel-drawer-body">
            <span className="">Channels</span>
            {channelsList && Object.values(channelsList).map((val,i)=><span className="main-page__channel-drawer-item" onClick={enterRoom} key={i} >{'#'+val.name}</span>)}
          </div>
        </div>
          {/* <h1 className="main-page__heading">WELCOME {user}!</h1>
          <button onClick={signOut} className="main-page__button">Logout</button>
          <button onClick={visibility} className="main-page__button-create main-page__button">Create Channel</button> */}
          {currentChannel 
            ? <Chatroom messages={messageList} testDataFlow={testDataFlow} channel={currentChannel} displayChannels={displayChannels}/>
            : <></>}
          {visible ? (<div className="main-page__modal">
          <form onSubmit={createRoom}>
            <div className="form-page__row">
              <label className="form-page__label" htmlFor="text">Channel Name</label>
              <input className="form-page__input" type="text" name="text" />
            </div>
            <div className="form-page__row">
              <label className="form-page__label" htmlFor="password">Password (Optional)</label>
              <input className="form-page__input" autoComplete="on" type="password" name="password" />
            </div>
            <div className="form-page__row form-page__row--button">
              <button className="form-page__button">CREATE</button>
            </div>
          </form>
          </div>)
          :<></>}
        </>)
        : <h1>LOADING...</h1>
      }
    </div>
  </>);
}