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
  const [currentChannel, setcurrentChannel] = useState(''); // general 
  const [messageList, setMessageList] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [forceRender, setForceRender] = useState(false);
  const [forceRender2, setForceRender2] = useState(false);
  let channelsDrawer = useRef();
  let channelsDrawerHeader = useRef();
  let auth = firebase.auth();
  let channels = firebase.database().ref().child('channels');

  function onAuthStateChange(){
        return  auth.onAuthStateChanged(cred=>{ 

        // retrieves list of channels
        channels.once('value', snap=>{
          console.log(snap.val()['-M4NiJvyfWLjTUJ3lsCK']); // general chat id
          let userSpecificChannels = Object.entries(snap.val()).filter(channel=>channel[1].users.includes(cred.email) || channel[1].name === 'General');
          userSpecificChannels = Object.fromEntries(userSpecificChannels);
          if (!channelsList) setChannelsList(userSpecificChannels); 
          if (!currentChannel) {
            setcurrentChannel(['-M4NiJvyfWLjTUJ3lsCK', {name: 'General'}]);
            setMessageList(Object.entries(snap.val()['-M4NiJvyfWLjTUJ3lsCK'].messages))
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
    // load messages
    if (user){
      firebase.database().ref(`channels`).child(currentChannel[0]).once('value', snap=>{
        setMessageList(Object.entries(snap.val().messages));
        console.log('hehehe');
      }).then(()=>channels.off('value'));
    }
  }, [forceRender2, currentChannel])
  
  useEffect(()=>{
    // to refresh channels list upon adding a new one
    if (user){
      channels.on('value', snap=>{
        let userSpecificChannels = Object.entries(snap.val()).filter(channel=>channel[1].users.includes(user) || channel[1].name === 'General');
        userSpecificChannels = Object.fromEntries(userSpecificChannels);
        setChannelsList(userSpecificChannels); 
      })
    }
  }, [forceRender])

  
  const displayChannels = () => {
    channelsDrawer.current.classList.toggle('burger-drawer--visible');
    channelsDrawerHeader.current.classList.toggle('burger-drawer__header--visible');
  }
  const enterRoom = (e)=> {
    channelsDrawer.current.classList.remove('burger-drawer--visible');
    channelsDrawerHeader.current.classList.remove('burger-drawer__header--visible');
    setcurrentChannel(e.target.id);
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
  const sendMessage = e=>{
    e.preventDefault();
    const {message} = e.target;
    let messageObj = {
      message: message.value, 
      sender: user,
      timestamp: Date.now()
    }

    firebase.database().ref('channels/' + currentChannel).child('messages').push(messageObj);
    setForceRender2(!forceRender2);
    e.target.reset();
  }

  return(<>
    <div className="main-page">
      {user 
        ? (<>
          {showModal 
            // ? <Modal hideModal={showModalForm}><SearchChannels handler={createRoom} /> </Modal> 
            ? <Modal hideModal={showModalForm}><ModalForm handler={createRoom} /> </Modal> 
            : <></>}
          <BurgerDrawer showModal={showModalForm} channelsList={channelsList} enterRoom={enterRoom} ref={{channelsDrawer, channelsDrawerHeader}} />
          <Chatroom messages={messageList} testDataFlow={sendMessage} channel={currentChannel} displayChannels={displayChannels}/>
        </>)
        : <h1>LOADING...</h1>
      }
    </div>
  </>);
}