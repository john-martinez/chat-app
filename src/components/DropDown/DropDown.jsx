import React from 'react'
import './DropDown.scss';

export default function DropDown({signOut, user}){
  return(
    <div className="dropdown">        
        <div className="dropdown__options">Hello, {user}</div>
        <div onClick={signOut} className="dropdown__options">Sign Out</div>
    </div>
  );
}