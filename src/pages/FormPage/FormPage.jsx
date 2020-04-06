import React, { useState } from 'react';
import './FormPage.scss';

export default function FormPage(){
  const [activeTab, setActiveTab] = useState('login');
  
  const onClickHandler = e => setActiveTab(e.target.dataset.value);
  return(
    <div className="form-page">
      <div className="form-page__overlay"></div>
      <div className="form-page__form">
      <div onClick={onClickHandler} data-value="login" className={`form-page__tab ${activeTab === 'login' ? 'form-page__tab--active ' : ''}`}>LOGIN</div>
      <div onClick={onClickHandler} data-value="signup" className={`form-page__tab2 ${activeTab === 'signup' ? 'form-page__tab--active ' : ''}`}>SIGN UP</div>
      <h2 className="form-page__header">{activeTab==='login'? 'LOGIN' : 'REGISTER'}</h2>
        <form>
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
              <input className="form-page__input" type="password" name="confirm" />
            </div>
            <div className="form-page__row">
              <label className="form-page__label" htmlFor="display-name">DISPLAY NAME</label>
              <input className="form-page__input" type="text" name="displayName" />
            </div>
          </>)}
          <div className="form-page__row form-page__row--button">
            <span className="form-page__button">SIGN {activeTab==='login'? `IN` : 'UP'}</span>
          </div>
          <div className="form-page__row">
            <span className="form-page__button form-page__button--fb"> {activeTab==='login'? `Connect` : 'Sign up'} with facebook</span>
          </div>
        </form>
      </div>
    </div>
  );
}