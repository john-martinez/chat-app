import React from 'react';
import './SearchMessages.scss';

export default function SearchMessages({channel}){

    console.log(channel);
    return <input type="text" placeholder="Search messages..." className="sm__search"></input>;
}