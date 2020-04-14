import React,{useState} from 'react';
import './ModalProfile.scss';
import PhoneInput from 'react-phone-number-input'

export default function ModalProfile({hideModal}){
    const [value, setValue] = useState();
    // console.log(value);

    const updateProfile = (e) =>{
        e.preventDefault();
        const {text, textImage, phone} =e.target;
        console.log(e.target);
        e.target.reset();
        hideModal();
    }

  return(
    <div className="modal-profile">
        <button className="modal-profile__close form-page__button" onClick={hideModal}>X</button>
      <form onSubmit={updateProfile}>
        <div className="form-page__row">
            <label className="form-page__label" htmlFor="text">Display Name</label>
            <input className="form-page__input" type="text" name="text" placeholder="Profile Display Name" />
        </div>
        <div className="form-page__row">
            <label className="form-page__label" htmlFor="text-image">Display Picture</label>
            <input className="form-page__input" type="url" name="textImage" placeholder="Enter Image URL Only" />
        </div>
        <div className="form-page__row">
            <label className="form-page__label" htmlFor="phone">Phone Number</label>
            <PhoneInput defaultCountry="CA" placeholder="Enter Phone Number" value={value} onChange={setValue} className="modal-profile__phone" name="phone"/>
        </div>
        <div className="form-page__row form-page__row--button">
            <button className="form-page__button">Update</button>
          </div>
      </form>
    </div>
  );
}