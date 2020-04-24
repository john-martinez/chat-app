import React,{useState} from 'react';
import './ModalProfile.scss';
import PhoneInput from 'react-phone-number-input'
import firebase from 'firebase/app';
import 'firebase/firebase-auth';
import 'firebase/firebase-database';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

export default function ModalProfile({hideModal}){
    const user = firebase.auth().currentUser;
    const [value, setValue] = useState({
        displayName: user.displayName,
        photoURL : user.photoURL
    });
    const [phone, setPhone] = useState(user.phoneNumber);
    


    const updateProfile = (e) =>{
        e.preventDefault();
        user.updateProfile({
            displayName: value.displayName,
            photoURL: value.photoURL
          }).then(res=>console.log('success')).catch(err=>console.log(err));
        e.target.reset();
        hideModal();
    }

    const handleChange = (e) => {
        setValue({...value, [e.target.name] : e.target.value});
    }
    

    
  return(
    <div className="modal-profile">
        <button className="modal-profile__close form-page__button" onClick={hideModal}>X</button>
      <form onSubmit={updateProfile}>
        <div className="modal-profile__row">
            <label className="form-page__label" htmlFor="text">Display Name</label>
            <input className="form-page__input" type="text" name="displayName" placeholder="Profile Display Name" value={value.displayName ? value.displayName : ''} onChange={handleChange} />
        </div>
        <div className="modal-profile__row">
            <label className="form-page__label" htmlFor="text-image">Display Picture</label>
            <div className="modal-profile__image-container">
                {value.photoURL ? (<img src={value.photoURL} className="modal-profile__image" alt="avatar"/>) : <FontAwesomeIcon icon={faUserCircle} className="modal-profile__image"/>}
                <input className="form-page__input modal-profile__url" type="url" name="photoURL" placeholder="Enter Image URL Only" value={value.photoURL ? value.photoURL : ''} onChange={handleChange}/>
            </div>
        </div>
        <div className="modal-profile__row">
            <label className="form-page__label" htmlFor="phone">Phone Number</label>
            <PhoneInput defaultCountry="CA" value={phone ? phone : ''} onChange={setPhone} className="modal-profile__phone" name="phoneNumber"/>
        </div>
        <div className="modal-profile__row form-page__row--button">
            <button className="form-page__button">Update</button>
          </div>
      </form>
    </div>
  );
}