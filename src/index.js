import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './components/App/App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyD5dNdKlt4dn6Nb634yBlWtPdcWnEPwznM",
  authDomain: "chat-app-22717.firebaseapp.com",
  databaseURL: "https://chat-app-22717.firebaseio.com",
  projectId: "chat-app-22717",
  storageBucket: "chat-app-22717.appspot.com",
  messagingSenderId: "951478077758",
  appId: "1:951478077758:web:f48ce20c649f63c80b846f",
  measurementId: "G-PXQNQW06TJ"
};
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
