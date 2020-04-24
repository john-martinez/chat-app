import React from 'react'
import './DropDown.scss';
import firebase from 'firebase/app';
import 'firebase/firebase-auth';
import 'firebase/firebase-database';
import {faUserCircle} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function DropDown({user, editProfile, signOut}){

  const auth = firebase.auth().currentUser;

  return(
    <div className="dropdown">        
        <div className="dropdown__options-text-only">{auth.photoURL ? (<img src={auth.photoURL} alt="avatar" className="dropdown__image"/>) : <FontAwesomeIcon icon={faUserCircle} className="dropdown__image"/>}{auth.displayName ? auth.displayName : user}</div>
        <div onClick={editProfile} className="dropdown__options">Edit Profile</div>
        <div onClick={signOut} className="dropdown__options">Sign Out</div>
    </div>
  );
}