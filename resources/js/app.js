import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Router, Switch
} from 'react-router-dom';

import history from './history';

import Main from './scenes/Main';
import Login from './scenes/Auth/Login';
import Forgot from './scenes/Auth/Forgot';
import Reset from './scenes/Auth/Reset';

import {
  login
} from './actions/common';
import Api from './apis/app';
import {
  AuthRoute, AuthenticatedRoute
} from './components/PrivateRoutes';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialized: false
    };
  }

  async componentDidMount() {
    const auth = Api.getAuth();
    if (auth !== null) {
      await this.props.login(auth);
    }
    this.setState({
      initialized: true
    });
  }

  render() {
    const {
      initialized
    } = this.state;
    return (
      initialized ? (
        <Router history={history}>
          <Switch>
            <AuthenticatedRoute path="/forgot" name="Forgot" component={Forgot} />
            <AuthenticatedRoute path="/reset/:token" name="Reset" component={Reset} />
            <AuthenticatedRoute path="/login" name="Login" component={Login} />
            <AuthRoute path="/" name="Main" component={Main} />
          </Switch>
        </Router>
      ) : null
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  login: bindActionCreators(login, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
