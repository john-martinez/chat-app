import React from 'react';
import './FormPage.scss';

export default function FormPage(){
  return(
    <div className="form-page">
      <div className="form-page__overlay"></div>
      <div className="form-page__form">
        <h2 className="form-page__header">WELCOME</h2>
        <form>
          <div className="form-page__row">
            <label className="form-page__label" htmlFor="email">EMAIL</label>
            <input className="form-page__input" type="email" name="email" />
          </div>
          <div className="form-page__row">
            <label className="form-page__label" htmlFor="email">PASSWORD</label>
            <input className="form-page__input" type="password" name="password" />
          </div>
          <div className="form-page__row">
            <span className="form-page__label">Forgot your password?</span>
          </div>
          <div className="form-page__row form-page__row--button">
            <span className="form-page__button">SIGN IN</span>
          </div>
          <div className="form-page__row">
            <span className="form-page__button form-page__button--fb">Connect with facebook</span>
          </div>
        </form>
      </div>
    </div>
  );
}