import React, { useState, useEffect, useRef } from 'react';
import Chatroom from '../../components/Chatroom/Chatroom';
import Modal from '../../components/Modal/Modal';
import BurgerDrawer from '../../components/BurgerDrawer/BurgerDrawer';
import ModalForm from '../../components/ModalForm/ModalForm';
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
  const [showModal, setShowModal] = useState(false);
  const [forceRender, setForceRender] = useState(false);
  let channelsDrawer = useRef();
  let channelsDrawerHeader = useRef();
  let auth = firebase.auth();
  let channels = firebase.database().ref().child('channels');

  function onAuthStateChange(){
        return  auth.onAuthStateChanged(cred=>{ 

        // retrieves list of channels
        channels.once('value', snap=>{

          let userSpecificChannels = Object.entries(snap.val()).filter(channel=>channel[1].users.includes(cred.email) || channel[1].name === 'General');
          userSpecificChannels = Object.fromEntries(userSpecificChannels);
          console.log(userSpecificChannels);
          if (!channelsList) setChannelsList(userSpecificChannels); 
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
    if (user){
      channels.once('value', snap=>{
        let chatrooms = Object.entries(snap.val());
        let chatroom = chatrooms.find(item=>item[1].name === currentChannel);
        let messages = Object.entries(chatroom[1].messages);
        setMessageList(messages);
      }).then(()=>channels.off('value'));
    }
  }, [currentChannel, user])
  
  useEffect(()=>{
    // to refresh channels list upon adding a new one
    channels.once('value', snap=>{
      console.log(channelsList)
      if (!channelsList && channelsList !== null) setChannelsList(snap.val());
    })
  }, [forceRender])

  const displayChannels = () => {
    channelsDrawer.current.classList.toggle('burger-drawer--visible');
    channelsDrawerHeader.current.classList.toggle('burger-drawer__header--visible');
  }
  const enterRoom = (e)=> {
    channelsDrawer.current.classList.remove('burger-drawer--visible');
    channelsDrawerHeader.current.classList.remove('burger-drawer__header--visible');
    setcurrentChannel(e.target.textContent.split("#")[1]);
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
    setForceRender(!forceRender);
  }
  
  const showModalForm = () => setShowModal(!showModal);
  const testDataFlow = e=>{
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
          {showModal ? <Modal hideModal={showModalForm}><ModalForm handler={createRoom} /> </Modal> : <></>}
          <BurgerDrawer showModal={showModalForm} channelsList={channelsList} enterRoom={enterRoom} ref={{channelsDrawer, channelsDrawerHeader}} />
          <Chatroom messages={messageList} testDataFlow={testDataFlow} channel={currentChannel} displayChannels={displayChannels}/>
        </>)
        : <h1>LOADING...</h1>
      }
    </div>
  </>);
}