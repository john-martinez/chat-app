import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase';

export default function MainPage(props){
  const [currentUser, setUser] = useState('');
  let user = sessionStorage.getItem('email');
  let auth = firebase.auth();

  useEffect(()=>{
    setUser(user)
  }, [])
  // redirects to login page if user did not login yet
  if (!user) props.history.push('/login'); 

  const signOut = () => {
    auth.signOut();
    setUser('');
    sessionStorage.removeItem('email');
  }


  return(
    <div className="main-page">
        <h1>WELCOME {currentUser}!</h1>
        <button onClick={signOut}>logout</button>
    </div>
  );
}