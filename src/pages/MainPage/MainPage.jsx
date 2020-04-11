import React, { useState, useEffect, useRef } from 'react';
import Chatroom from '../../components/Chatroom/Chatroom';
import Modal from '../../components/Modal/Modal';
import BurgerDrawer from '../../components/BurgerDrawer/BurgerDrawer';
import ModalForm from '../../components/ModalForm/ModalForm';
import SearchChannels from '../../components/SearchChannels/SearchChannels';
import firebase from 'firebase/app';
import 'firebase/firebase-auth';
import 'firebase/firebase-database';
import '../FormPage/FormPage.scss';
import './MainPage.scss';

export default function MainPage(props){
  const [user, setUser] = useState('');
  const [channelsList, setChannelsList] = useState(null);
  const [currentChannel, setcurrentChannel] = useState('');  
  const [messageList, setMessageList] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSearch, setShowSearch] = useState(true);

  // force render hooks
  const [channelCreated, setChannelCreated] = useState(false);

  // refs
  const channelsDrawer = useRef();
  const channelsDrawerHeader = useRef();
  const previousMessageList = useRef();
  const completeChannelsList = useRef();

  // database setup
  const auth = firebase.auth();
  const channels = firebase.database().ref().child('channels');

  function onAuthStateChange(){
        return  auth.onAuthStateChanged(cred=>{ 
        // Initialization
        channels.once('value', snap=>{
          completeChannelsList.current = snap.val();
          let userSpecificChannels = Object.entries(snap.val()).filter(channel=> {
            let x = Object.values(channel[1].users);
            return x.includes(cred.email) || channel[1].name === 'general'
          })
          userSpecificChannels = Object.fromEntries(userSpecificChannels);
          if (!channelsList) setChannelsList(userSpecificChannels); 
          if (!currentChannel) {
            setcurrentChannel(['0', {name: 'general'}]); // general chat 
            setMessageList(Object.entries(snap.val()['0'].messages))
          }
        })

        // redirect when user is not signed in
        if (cred) setUser(cred.email)
        else props.history.push('/login')
    })
  }
  useEffect(()=>{
  // componentDidMount
    const unsubscribe = onAuthStateChange();
    return ()=>{
      unsubscribe();
    }
  }, [])

  useEffect(()=>{
    // componentDidUpdate

    // need to revise this into child_added later on
    if (currentChannel){
      firebase.database().ref(`channels/${currentChannel[0]}`).child('messages').on('value', snap=>{
        let msgs = Object.entries(snap.val());
        if (previousMessageList.current !== msgs.length) setMessageList(msgs);
        previousMessageList.current = msgs.length;
      })
    }
    firebase.database().ref().child('channels').on('value', snap=>{
      if (completeChannelsList.current && Object.entries(completeChannelsList.current).length !== Object.entries(snap.val()).length)
        completeChannelsList.current = snap.val();
    })
  })

  useEffect(()=>{
    // load messages when switching channels
    if (user){
      firebase.database().ref(`channels`).child(currentChannel[0]).once('value', snap=>{
        setMessageList(Object.entries(snap.val().messages));
      }).then(()=>channels.off('value'));
    }
  }, [currentChannel])
  
  useEffect(()=>{
    // to refresh channels list upon adding a new one
    if (user){
      channels.on('value', snap=>{
        let userSpecificChannels = Object.entries(snap.val()).filter(channel=>{
          let x = Object.values(channel[1].users);
          return x.includes(user) || channel[1].name === 'general'
        });
        userSpecificChannels = Object.fromEntries(userSpecificChannels);
        setChannelsList(userSpecificChannels); 
      })
    }
  }, [channelCreated, showModal])

  
  const displayChannels = () => {
    channelsDrawer.current.classList.toggle('burger-drawer--visible');
    channelsDrawerHeader.current.classList.toggle('burger-drawer__header--visible');
  }
  const enterRoom = (e, channel)=> {
    channelsDrawer.current.classList.remove('burger-drawer--visible');
    channelsDrawerHeader.current.classList.remove('burger-drawer__header--visible');
    setcurrentChannel(channel);
  }
  const signOut = () => auth.signOut();
  const createRoom = (e) => {
    e.preventDefault();
    const {name, password} = e.target;
    channels.push().set({
      name: `${name.value}`,
      password:`${password.value}`,
      users: [user],
      messages: [{message: 'Hello, welcome to the new chatroom!', sender: 'default'}]
    });
    e.target.reset();
    setShowModal(false);
    setChannelCreated(!channelCreated);
  }
  
  const addUserToChannel = key => {
    // console.log();
    firebase.database().ref('channels/' + key).child('users').push(user);
    setShowModal(false);
  }

  const toggleSearchOrFind = () => setShowSearch(!showSearch)
  const showModalForm = () => setShowModal(!showModal);
  const sendMessage = e=>{
    e.preventDefault();
    const {message} = e.target;
    let messageObj = {
      message: message.value, 
      sender: user,
      timestamp: Date.now()
    }

    firebase.database().ref('channels/' + currentChannel[0]).child('messages').push(messageObj);
    e.target.reset();
  }

  return(<>
    <div className="main-page">
      {user 
        ? (<>
          {showModal 
            ? showSearch 
              ? <Modal hideModal={showModalForm}><SearchChannels channelsList={completeChannelsList.current} user={user} handler={toggleSearchOrFind} addUserToChannel={addUserToChannel} /> </Modal> 
              : <Modal hideModal={showModalForm}><ModalForm createRoom={createRoom} handler={toggleSearchOrFind}/> </Modal> 
            : <></>}
          <BurgerDrawer showModal={showModalForm} channelsList={channelsList} enterRoom={enterRoom} ref={{channelsDrawer, channelsDrawerHeader}} />
          <Chatroom messages={messageList} testDataFlow={sendMessage} channel={currentChannel} displayChannels={displayChannels}/>
        </>)
        : <h1>LOADING...</h1>
      }
    </div>
  </>);
}