import React,{useState} from 'react';
import './Navbar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faEllipsisV, faSearch } from '@fortawesome/free-solid-svg-icons'
import DropDown from '../DropDown/DropDown';

export default function Navbar({displayChannels, channel, user, editProfile, signOut}) {

  const [showDropDown, setShowDropDown] = useState(false);
  const showDropDownHandler = () => {    
    setShowDropDown(!showDropDown);    
  }
  const [search, setSearch] = useState(false);
  const showSearchHandler = () => {    
    setSearch(!search);
  }
  
  return (
    <header className="header">
      <nav className="navbar">
        <div className="navbar__burger" onClick={()=>displayChannels()}>
          <FontAwesomeIcon icon={faBars} />
        </div>
        <div className="navbar__channel-name">
          #{channel.length && channel[1].name}
        </div>
        <div className="navbar__right">
          <span className="navbar__spans">
            {search ? (<input type="text" placeholder="Search messages..." className="navbar__search"></input>) : <></>}
            <FontAwesomeIcon icon={faSearch} className="navbar__search-icon" onClick={showSearchHandler} /> 
          </span>
          <span className="navbar__spans">
            {showDropDown ? (<DropDown user={user} editProfile={editProfile} signOut={signOut}/>) : <></>}
            <FontAwesomeIcon icon={faEllipsisV} onClick={showDropDownHandler}/> 
          </span>
        </div>
      </nav>
    </header>
  );
};