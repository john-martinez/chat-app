import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firebase-auth';

export default function MainPage(props){
  const [user, setUser] = useState('');
  let auth = firebase.auth();
  useEffect(()=>{
    // cred is empty if the user is not signed in
    auth.onAuthStateChanged(cred=>{ 
      if (cred) setUser(cred.email)
      else props.history.push('/login')
    })
  }, [user, auth, props.history])

  const signOut = () => auth.signOut()
  return(
    <div className="main-page">
      {user 
        ? (<>
          <h1>WELCOME {user}!</h1>
          <button onClick={signOut}>logout</button>
        </>)
        : <h1>LOADING...</h1>
      }
    </div>
  );
}