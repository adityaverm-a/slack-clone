import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import reportWebVitals from './reportWebVitals';

import 'semantic-ui-css/semantic.min.css';
import 'rc-drawer/assets/index.css';

import { BrowserRouter as Router, Switch, Route, withRouter, useHistory } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Spinner from './components/Spinner';
import firebase from 'firebase';

import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './store';
import { clearUser, setUser } from './actions/auth';

const Root = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const loading = useSelector(state => state.auth.loading);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        dispatch(setUser(user));
        history.push('/');
      } else {
        history.replace('/login');
        dispatch(clearUser());
      }
    })
  }, [history, dispatch]);

  return loading ? (<Spinner />) : (
    <Switch>
      <Route exact path='/' component={App} />
      <Route path='/login' component={Login} />
      <Route path='/register' component={Register} />
    </Switch>
  )
}

const RootWithRouter = withRouter(Root);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithRouter />
    </Router>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
