import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCaretDown } from '@fortawesome/free-solid-svg-icons'


export default function BurgerDrawerItem({ conversationsList, enterRoom, showModal }){
  const channelContainer = useRef();
  const channelIcon = useRef();
  const hideMenu = e => {
    channelContainer.current.classList.toggle('burger-drawer__channel-container--hidden');
    channelIcon.current.classList.toggle('burger-drawer__item-icon--hidden');
  }
  return(<>
    <div className="burger-drawer__item-header-container">
      <span className="burger-drawer__item-header" onClick={hideMenu}>
      <span className="burger-drawer__item-icon" ref={channelIcon}><FontAwesomeIcon icon={faCaretDown} /></span> Channels</span>
      <span className="burger-drawer__item-header--icon" onClick={showModal} ><FontAwesomeIcon icon={faPlus} /></span>
    </div>
    <div className="burger-drawer__channel-container" ref={channelContainer} >
      {conversationsList && Object.entries(conversationsList).map((val,i)=><span className="burger-drawer__item" onClick={()=>enterRoom(val)} key={i} >{'#'+val[1].name}</span>)}
    </div>
  </>);
}