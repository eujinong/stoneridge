import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Store from '../store';

export const AuthRoute = ({ component: Component, ...rest }) => {
  const { auth } = Store.getState().common;
  return (
    <Route
      {...rest}
      render={props => (auth
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />)}
    />
  );
};

export const AuthenticatedRoute = ({ component: Component, ...rest }) => {
  const { auth } = Store.getState().common;
  return (
    <Route
      {...rest}
      render={props => (auth
        ? <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        : <Component {...props} />)}
    />
  );
};