import React from 'react';
import './Navbar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faEllipsisV, faSearch } from '@fortawesome/free-solid-svg-icons'

export default function Navbar({displayChannels, channel}) {
  return (
    <header className="header">
      <nav className="navbar">
        <div className="navbar__burger" onClick={displayChannels}>
          <FontAwesomeIcon icon={faBars} />
        </div>
        <div className="navbar__channel-name">
          #{channel}
        </div>
        <div className="navbar__right">
          <FontAwesomeIcon icon={faSearch} />
          <FontAwesomeIcon icon={faEllipsisV} />
        </div>
      </nav>
    </header>
  );
};