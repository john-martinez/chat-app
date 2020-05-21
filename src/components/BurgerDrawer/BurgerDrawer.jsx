import React from 'react';
import BurgerDrawerItem from '../BurgerDrawerItem/BurgerDrawerItem';
import './BurgerDrawer.scss';

const BurgerDrawer = React.forwardRef(({channelsList, enterRoom, showModal },{channelsDrawerHeader, channelsDrawer})=> {
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
        <BurgerDrawerItem 
          conversationsList={channelsList}
          enterRoom={enterRoom}
          showModal={showModal}
        />
        <BurgerDrawerItem 
          conversationsList={channelsList}
          enterRoom={enterRoom}
          showModal={showModal}
        />
        <BurgerDrawerItem 
          conversationsList={channelsList}
          enterRoom={enterRoom}
          showModal={showModal}
        />
        <BurgerDrawerItem 
          conversationsList={channelsList}
          enterRoom={enterRoom}
          showModal={showModal}
        />
      </div>
    </div>
  );
})

export default BurgerDrawer;