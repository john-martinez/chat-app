import React,{useState} from 'react';
import './Navbar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faEllipsisV, faSearch } from '@fortawesome/free-solid-svg-icons'
import DropDown from '../DropDown/DropDown';

export default function Navbar({displayChannels, channel, signOut, user}) {

  const [showDropDown, setShowDropDown] = useState(false);
  const showDropDownHandler = () => setShowDropDown(!showDropDown);

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
          <span>
            <FontAwesomeIcon icon={faSearch}/>
          </span>
          <span onClick={showDropDownHandler}>
            {showDropDown ? (<DropDown signOut={signOut} user={user}/>) : <></>}
            <FontAwesomeIcon icon={faEllipsisV}/> 
          </span>
        </div>
      </nav>
    </header>
  );
};