import React from 'react';
import './SearchChannels.scss';

export default function SearchChannels(props){
  return(
    <form className="search-channels">
      <h2 className="search-channels__header">Join existing channels</h2>
      <label className="search-channels__label" htmlFor="channelName"></label> <br/>
      <input className="search-channels__input" type="text" name="channelName" maxLength="20" /> <br/>

    </form>
  );
}