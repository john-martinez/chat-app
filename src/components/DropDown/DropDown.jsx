import React from 'react'
import './DropDown.scss';

export default function DropDown({user, editProfile, signOut}){

  return(
    <div className="dropdown">        
        <div className="dropdown__options-text-only">Hello, {user}</div>
        <div onClick={editProfile} className="dropdown__options">Edit Profile</div>
        <div onClick={signOut} className="dropdown__options">Sign Out</div>
    </div>
  );
}