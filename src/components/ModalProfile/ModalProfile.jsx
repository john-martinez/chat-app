import React,{useState} from 'react';
import './ModalProfile.scss';
import PhoneInput from 'react-phone-number-input'
import firebase from 'firebase/app';
import 'firebase/firebase-auth';
import 'firebase/firebase-database';

export default function ModalProfile({hideModal}){
    const user = firebase.auth().currentUser;
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const updateProfile = (e) =>{
        e.preventDefault();
        // user.updateProfile({
        //     displayName: name,
        //     photoURL: image,
        //     phoneNumber: phone
        //   }).then(res=>console.log('success', res)).catch(err=>console.log(err));
        console.log(phone, name, image);
        e.target.reset();
        hideModal();
    }

  return(
    <div className="modal-profile">
        <button className="modal-profile__close form-page__button" onClick={hideModal}>X</button>
      <form onSubmit={updateProfile}>
        <div className="form-page__row">
            <label className="form-page__label" htmlFor="text">Display Name</label>
            <input className="form-page__input" type="text" name="text" placeholder="Profile Display Name" value={name} onChange={setName} />
        </div>
        <div className="form-page__row">
            <label className="form-page__label" htmlFor="text-image">Display Picture</label>
            <input className="form-page__input" type="url" name="textImage" placeholder="Enter Image URL Only" value={image} onChange={setImage}/>
        </div>
        <div className="form-page__row">
            <label className="form-page__label" htmlFor="phone">Phone Number</label>
            <PhoneInput defaultCountry="CA" placeholder="Enter Phone Number" value={phone} onChange={setPhone} className="modal-profile__phone" name="phone"/>
        </div>
        <div className="form-page__row form-page__row--button">
            <button className="form-page__button">Update</button>
          </div>
      </form>
    </div>
  );
}