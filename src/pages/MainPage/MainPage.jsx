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
import ModalProfile from '../../components/ModalProfile/ModalProfile';

export default function MainPage(props){
  const [user, setUser] = useState('');
  const [channelsList, setChannelsList] = useState(null);
  const [currentChannel, setcurrentChannel] = useState('');  
  const [showModal, setShowModal] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [profileModal, setProfileModal] = useState(false);  

  // force render hooks
  const [channelCreated, setChannelCreated] = useState(false);

  // refs
  const channelsDrawer = useRef();
  const chatroom = useRef();
  const channelsDrawerHeader = useRef();
  const completeChannelsList = useRef();

  // database setup
  const auth = firebase.auth();
  const channels = firebase.database().ref().child('channels');

  
  useEffect(()=>{ channels.on('value', snap=> completeChannelsList.current = snap.val())})  
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

  function onAuthStateChange(){
        return  auth.onAuthStateChanged(cred=>{ 
        // Initialization
        if(cred){channels.once('value', snap=>{
          completeChannelsList.current = snap.val();
          let userSpecificChannels = Object.entries(snap.val()).filter(channel=> {
            let x = Object.values(channel[1].users);
            return x.includes(cred.email) || channel[1].name === 'general'
          })
          userSpecificChannels = Object.fromEntries(userSpecificChannels);
          if (!channelsList) setChannelsList(userSpecificChannels); 
          if (!currentChannel) setcurrentChannel(['0', {name: 'general'}]);
        })}

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

  const displayChannels = (hideDrawer = false) => {
    if (!hideDrawer){
      chatroom.current.classList.toggle('chat-room--small');
      channelsDrawer.current.classList.toggle('burger-drawer--visible');
      channelsDrawerHeader.current.classList.toggle('burger-drawer__header--visible');
    } else {
      chatroom.current.classList.remove('chat-room--small');
      channelsDrawer.current.classList.remove('burger-drawer--visible');
      channelsDrawerHeader.current.classList.remove('burger-drawer__header--visible');
    }
  }
  const enterRoom = channel=> {
    chatroom.current.classList.remove('chat-room--small');
    channelsDrawer.current.classList.remove('burger-drawer--visible');
    channelsDrawerHeader.current.classList.remove('burger-drawer__header--visible');
    setcurrentChannel(channel)
  }

  const createRoom = (e) => {
    e.preventDefault();
    const {name, password} = e.target;
    channels.push().set({
      name: `${name.value}`,
      password:`${password.value}`,
      users: [user],
      messages: [{message: 'Hello, welcome to the new chatroom!', sender: 'BasedChatBot'}]
    });
    e.target.reset();
    setShowModal(false);
    setChannelCreated(!channelCreated);
  }
  
  const addUserToChannel = key => {
    firebase.database().ref('channels/' + key).child('users').push(user);
    setShowModal(false);
  }

  const toggleSearchOrFind = () => setShowSearch(!showSearch)
  const showModalForm = () => setShowModal(!showModal);
  const signOut = () => auth.signOut();
  const showProfileModal = () => setProfileModal(!profileModal);
  
  return(<>
    <div className="main-page">
      {user && currentChannel
        ? (<>
          {showModal 
            ? showSearch 
              ? <Modal hideModal={showModalForm}><SearchChannels channelsList={completeChannelsList.current} user={user} handler={toggleSearchOrFind} addUserToChannel={addUserToChannel} /> </Modal> 
              : <Modal hideModal={showModalForm}><ModalForm createRoom={createRoom} handler={toggleSearchOrFind}/> </Modal> 
            : <></>}
            {profileModal ? (<Modal hideModal={showProfileModal}><ModalProfile hideModal={showProfileModal} /></Modal>): <></>}
          <BurgerDrawer showModal={showModalForm} channelsList={channelsList} enterRoom={enterRoom} ref={{channelsDrawer, channelsDrawerHeader, chatroom}} />
          <Chatroom ref={chatroom} user={user} channel={currentChannel} displayChannels={displayChannels} editProfile={showProfileModal} signOut={signOut} />
        </>)
        : <h1>LOADING...</h1>
      }
    </div>
  </>);
}