import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCaretDown } from '@fortawesome/free-solid-svg-icons'

import './BurgerDrawer.scss';

const BurgerDrawer = React.forwardRef(({channelsList, enterRoom, showModal },{channelsDrawerHeader, channelsDrawer})=> {
  const channelContainer = useRef();
  const channelIcon = useRef();
  const hideMenu = e => {
    channelContainer.current.classList.toggle('burger-drawer__channel-container--hidden');
    channelIcon.current.classList.toggle('burger-drawer__item-icon--hidden');
  }
  return(
    <div className="burger-drawer" ref={channelsDrawer}>
      <div className="burger-drawer__header" ref={channelsDrawerHeader}>
        <div className="burger-drawer__header--left">
          <div className="placeholder-pic"></div>
        </div>
        <div className="burger-drawer__header--right">
          <input className="burger-drawer__search" type="text" name="search-channels" />
        </div>
      </div>
      <div className="burger-drawer__body">
        <div className="burger-drawer__item-header-container">
          <span className="burger-drawer__item-header" onClick={hideMenu}>
          <span className="burger-drawer__item-icon" ref={channelIcon}><FontAwesomeIcon icon={faCaretDown} /></span> Channels</span>
          <span className="burger-drawer__item-header--icon" onClick={showModal} ><FontAwesomeIcon icon={faPlus} /></span>
        </div>
        <div className="burger-drawer__channel-container" ref={channelContainer} >
          {channelsList && Object.entries(channelsList).map((val,i)=><span className="burger-drawer__item" onClick={()=>enterRoom(val)} key={i} >{'#'+val[1].name}</span>)}
        </div>
      </div>
    </div>
  );
})

export default BurgerDrawer;