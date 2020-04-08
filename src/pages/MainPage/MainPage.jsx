import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firebase-auth';
import 'firebase/firebase-database';

export default function MainPage(props){
  const [user, setUser] = useState('');
  const [channelsList, setChannelsList] = useState('');
  let auth = firebase.auth();
  let channels = firebase.database().ref().child('channels');
  
  useEffect(()=>{
    // cred is empty if the user is not signed in
    auth.onAuthStateChanged(cred=>{ 
      channels.on('value', snap=>{
        console.log(Object.keys(snap.val())); // stopped here
      });

      if (cred) setUser(cred.email)
      else props.history.push('/login')
    })
  }, [user, auth, props.history, channels])

  const signOut = () => auth.signOut()
  const createRoom = () => {
    channels.push().set({
      name: '#general',
      password:'',
      users: [],
      messages: []
    });
  }

  return(
    <div className="main-page">
      {user 
        ? (<>
          <h1>WELCOME {user}!</h1>
          <button onClick={signOut}>logout</button>
          <button onClick={createRoom}>create channel</button>
        </>)
        : <h1>LOADING...</h1>
      }
    </div>
  );
}