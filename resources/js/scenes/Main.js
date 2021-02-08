import React, { Component } from 'react';
import {
  Router, Switch
} from 'react-router-dom';

import { AuthRoute } from '../components/PrivateRoutes';

import history from '../history';

import Client from './Admin/Client';
import Bond from './Admin/Bond';
import Attorney from './Admin/Attorney';
import SuperAdmin from './Admin/SuperAdmin';
import NewBond from './Client/NewBond';
import EditBond from './Client/EditBond';
import MyBond from './Client/MyBond';
import MyAction from './Attorney/MyAction';
import MyClient from './Attorney/MyClient';
import Profile from './Profile';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    if (this.props.location.pathname == '/') {
      this.props.history.push('/clients');
    }
  }

  render() {
    return (
      <Router history={history}>
        <Switch>
          <AuthRoute path="/clients" name="Client" component={Client} />
          <AuthRoute path="/bonds" name="Bond" component={Bond} />
          <AuthRoute path="/attorneys" name="Attorney" component={Attorney} />
          <AuthRoute path="/superadmins" name="SuperAdmin" component={SuperAdmin} />
          <AuthRoute path="/profile" name="Profile" component={Profile} />
          <AuthRoute path="/new-bond" name="NewBond" component={NewBond} />
          <AuthRoute path="/my-bonds/detail" name="EditBond" component={EditBond} />
          <AuthRoute path="/my-bonds" name="MyBond" component={MyBond} />
          <AuthRoute path="/my-actions" name="MyAction" component={MyAction} />
          <AuthRoute path="/my-clients" name="MyClient" component={MyClient} />
        </Switch>
      </Router>
    );
  }
}

export default Main;
