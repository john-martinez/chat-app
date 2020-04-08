import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firebase-auth';
import 'firebase/firebase-database';
import '../FormPage/FormPage.scss';
import './MainPage.scss';

export default function MainPage(props){
  const [user, setUser] = useState('');
  const [channelsList, setChannelsList] = useState(null);
  const [visible, setVisible] = useState(false);
  const [currentChannel, setcurrentChannel] = useState(null);
  const [messageList, setMessageList] = useState(null);
  let auth = firebase.auth();
  let channels = firebase.database().ref().child('channels');

  function onAuthStateChange(){
        return  auth.onAuthStateChanged(cred=>{ 
      // console.log(cred);
      channels.once('value', snap=>{
        // console.log(snap.val());
        if (!channelsList) setChannelsList(snap.val()) // stopped here
      });
      if (cred) setUser(cred.email)
      else props.history.push('/login')
    })
      }
      useEffect(()=>{
        // cred is empty if the user is not signed in
        const unsubscribe = onAuthStateChange();
        return ()=>{
          unsubscribe();
        }
      })
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

  const enterRoom = (e)=>{
    setcurrentChannel(e.target.textContent);
  }
  const testDataFlow = (e)=>{
    e.preventDefault();
    const {message} = e.target;
    console.log(message.value, currentChannel);
    let test = Object.entries(channelsList).find(val => val[1].name === currentChannel);
    let messageObj = {
      message: message.value, 
      sender: user
    }
    console.log(messageObj);
    firebase.database().ref('channels/' + test[0]).child('messages').push(
      messageObj
    );
    
    firebase.database().ref('channels/' + test[0]).child('messages').on('value', snap=> {
      let messageHistory = Object.entries(snap.val());
      setMessageList(messageHistory.map(val=> val[1]));
    })
    e.target.reset();
  }



  return(
    <div className="main-page">
      {user 
        ? (<>
          <h1 className="main-page__heading">WELCOME {user}!</h1>
          <button onClick={signOut} className="main-page__button">Logout</button>
          <button onClick={visibility} className="main-page__button-create main-page__button">Create Channel</button>
        {channelsList && Object.values(channelsList).map((val,i)=><button onClick={enterRoom} key={i} className="main-page__button main-page__channels">{val.name}</button>)}
          {currentChannel ? (<div className="main-page__chat-room">
            <h1>{currentChannel}</h1>
        {messageList && messageList.map((val,i) => <div key={i}>{val.message}</div>)}
            <form onSubmit={testDataFlow}><input type="test" name="message"/><button>SEND</button></form>
          </div>) : <></>}
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
  );
}