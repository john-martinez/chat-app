import React, { useState } from 'react';
import './FormPage.scss';
import * as firebase from 'firebase';

export default function FormPage(props){
  const [activeTab, setActiveTab] = useState('login');
  const auth = firebase.auth();

  document.title = `${activeTab === 'login' ? 'LOGIN | ' : 'SIGNUP | ' } Chat App`;
  if (sessionStorage.getItem('email')) props.history.push('/');
  // const db = firebase.firestore();

  const onSubmitHandler = e => {
    e.preventDefault();
    const {email, password, confirm} = e.target;
    const form = e.target;
    if (password.value.trim().length && email.value.trim().length){
      if (activeTab === 'signup'){
        if (password.value.trim() === confirm.value.trim()){
          auth.createUserWithEmailAndPassword(email.value, password.value)
          .then(data=>{
            sessionStorage.setItem('email',data.user.email);
            props.history.push('/')
            form.reset();
          })
          .catch(err=>console.log(err)) 
        } else console.log('Invalid input')
      } else {
        auth.signInWithEmailAndPassword(email.value, password.value)
          .then(data=>{
            sessionStorage.setItem('email',data.user.email);
            props.history.push('/')
            form.reset();
          })
          .catch(err=>console.log(err)) 
      }
    } else console.log('Invalid input');
  }
  const onClickHandler = e => setActiveTab(e.target.dataset.value);
  return(
    <div className="form-page">
      <div className="form-page__overlay"></div>
      <div className="form-page__form">
      <div onClick={onClickHandler} data-value="login" className={`form-page__tab ${activeTab === 'login' ? 'form-page__tab--active ' : ''}`}>LOGIN</div>
      <div onClick={onClickHandler} data-value="signup" className={`form-page__tab2 ${activeTab === 'signup' ? 'form-page__tab--active ' : ''}`}>SIGN UP</div>
      <h2 className="form-page__header">{activeTab==='login'? 'LOGIN' : 'REGISTER'}</h2>
        <form onSubmit={onSubmitHandler}>
          <div className="form-page__row">
            <label className="form-page__label" htmlFor="email">EMAIL</label>
            <input className="form-page__input" type="email" name="email" />
          </div>
          <div className="form-page__row">
            <label className="form-page__label" htmlFor="password">PASSWORD</label>
            <input className="form-page__input" autoComplete="on" type="password" name="password" />
          </div>
          {activeTab === 'login' 
          ? (
            <div className="form-page__row">
              <span className="form-page__label">Forgot your password?</span>
            </div>
          )
          :(<>
            <div className="form-page__row">
              <label className="form-page__label" htmlFor="confirm">CONFIRM PASSWORD</label>
              <input className="form-page__input" autoComplete="on" type="password" name="confirm" />
            </div>
          </>)}
          <div className="form-page__row form-page__row--button">
            <button className="form-page__button">SIGN {activeTab==='login'? `IN` : 'UP'}</button>
          </div>
          <div className="form-page__row">
            <button className="form-page__button form-page__button--fb"> {activeTab==='login'? `Connect` : 'Sign up'} with facebook</button>
          </div>
        </form>
      </div>
    </div>
  );
}