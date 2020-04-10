import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserFriends, faUser } from '@fortawesome/free-solid-svg-icons'
import './SearchChannels.scss';

export default function SearchChannels({channelsList, user, handler}){
  const [searchVal, setSearchVal ] = useState('');

  const onChangeHandler = e => setSearchVal(e.target.value)
  const displayChannelsList = () => {
    console.log(channelsList)
    let channels = Object.entries(channelsList);
    let res = channels.filter(channel=>channel[1].name.toLowerCase().includes(searchVal.toLowerCase()) && !channel[1].users.includes(user));
    res = res.map(item=>(
    <div className="search-channels__container" key={item[0]}>
      <div className="search-channels__results-item" >
        {item[1].name}
      </div>
      <div className="search-channels__results-icon">{item[1].users.length} <FontAwesomeIcon icon={faUserFriends}/></div>
    </div>
    ))
    return res;
  }
  displayChannelsList();
  return(
    <div className="search-channels">
      <h2 className="search-channels__header">Channels</h2>
      <span className="search-channels__create" onClick={handler}>Create</span>
      <div className="search-channels__field-container">
        <label className="search-channels__label" htmlFor="channelName"></label> <br/>
        <input className="search-channels__input" onChange={onChangeHandler} value={searchVal} type="text" name="channelName" maxLength="20" placeholder="general" /> <br/>
        <span className="search-channels__icon">#</span>
      </div>
      <div className="search-channels__results"> 
        {displayChannelsList()}
      </div>
    </div>
  );
}