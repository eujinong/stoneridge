import React, { Component } from 'react';
import {
  Router, Switch
} from 'react-router-dom';

import { AuthRoute } from '../components/PrivateRoutes';

import history from '../history';

import Client from './Admin/Client';
import Bond from './Admin/Bond';
import Attorney from './Admin/Attorney';
import Setting from './Admin/Setting';

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
          <AuthRoute path="/settings" name="Setting" component={Setting} />
        </Switch>
      </Router>
    );
  }
}

export default Main;
