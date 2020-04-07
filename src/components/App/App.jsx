import React from 'react';
import MainPage from '../../pages/MainPage/MainPage';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import FormPage from '../../pages/FormPage/FormPage';
import './App.scss';

function App() {
  return (
    <div className="App">
      <BrowserRouter >
        <Switch>
          <Route exact path='/' component={MainPage} />
          <Route path='/login' component={FormPage} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
