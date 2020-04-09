import React from 'react';
import './Modal.scss';

export default function Modal({children, hideModal}){
  return(
    <div className="modal">
      <div className="modal__overlay" onClick={hideModal}></div>
      <div className="modal__content">
        {children}
      </div>
    </div>
  );
}