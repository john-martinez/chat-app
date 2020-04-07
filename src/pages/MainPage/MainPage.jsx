import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase';

export default function MainPage(props){
  const [user, setUser] = useState(sessionStorage.getItem('email'));
  let auth = firebase.auth();
  useEffect(()=>{
    // redirects to login page if user did not login yet
    if (!user) props.history.push('/login'); 
  }, [user])

  const signOut = () => {
    auth.signOut();
    setUser('');
    sessionStorage.removeItem('email');
  }

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