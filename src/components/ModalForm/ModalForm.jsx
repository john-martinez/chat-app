import React from 'react';
import './ModalForm.scss';

export default function ModalForm({handler}){
  return(
    <form className="modal-form" onSubmit={handler}>
      <h2 className="modal-form__header">New Channel</h2>
      <label className="modal-form__label" htmlFor="name">Name</label> <br/>
      <input className="modal-form__input" type="text" name="name" maxLength="20" /> <br/>
      <label className="modal-form__label" htmlFor="password">Password (Optional)</label> <br/>
      <input className="modal-form__input" type="password" autoComplete="on" name="password" /> <br/>
      <button className="modal-form__button">CREATE</button>
    </form>
  );
}