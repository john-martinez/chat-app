import React from 'react';
import './SearchChannels.scss';

export default function SearchChannels(props){
  return(
    <div className="search-channels">
      <h2 className="search-channels__header">Join existing channels</h2>
      <div className="search-channels__field-container">
        <label className="search-channels__label" htmlFor="channelName"></label> <br/>
        <input className="search-channels__input" type="text" name="channelName" maxLength="20" /> <br/>
      </div>
    </div>
  );
}