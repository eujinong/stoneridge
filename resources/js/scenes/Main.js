import React, { Component } from 'react';
import {
  Router, Switch
} from 'react-router-dom';

import { AuthRoute } from '../components/PrivateRoutes';

import history from '../history';

import Client from './Admin/Client';
import Bond from './Admin/Bond';
import Attorney from './Admin/Attorney';

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
        </Switch>
      </Router>
    );
  }
}

export default Main;
