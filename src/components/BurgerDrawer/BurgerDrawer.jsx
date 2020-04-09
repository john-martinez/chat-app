import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCaretDown } from '@fortawesome/free-solid-svg-icons'

import './BurgerDrawer.scss';

const BurgerDrawer = React.forwardRef(({channelsList, enterRoom },{channelsDrawerHeader, channelsDrawer})=> {
  return(
    <div className="burger-drawer" ref={channelsDrawer}>
      <div className="burger-drawer__header" ref={channelsDrawerHeader}>
        <div className="burger-drawer__header--left">
          <div className="placeholder-pic"></div>
        </div>
        <div className="burger-drawer__header--right">
          <input className="burger-drawer__drawer-search" type="text" name="search-channels" />
        </div>
      </div>
      <div className="burger-drawer__body">
        <div className="burger-drawer__item-header-container">
          <span className="burger-drawer__item-header">
          <FontAwesomeIcon icon={faCaretDown} /> Channels</span>
          <span className="burger-drawer__item-header--icon"><FontAwesomeIcon icon={faPlus} /></span>
        </div>
        {channelsList && Object.values(channelsList).map((val,i)=><span className="burger-drawer__item" onClick={enterRoom} key={i} >{'#'+val.name}</span>)}
      </div>
    </div>
  );
})

export default BurgerDrawer;