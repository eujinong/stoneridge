import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  withRouter, NavLink as Link
} from 'react-router-dom';
import {
  Nav, Navbar, NavItem, NavLink
} from 'reactstrap';

import { logout } from '../actions/common';
import Bitmaps from '../theme/Bitmaps';

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  async handleLogout() {
    await this.props.logout();
    this.props.history.push('/');
  }

  render() {

    return (
      <div className="admin-sidebar">
        <div className="text-center" style={{width: 280}}>
          <img src={Bitmaps.logo} alt="StoneRidge" />
        </div>
        <Nav>
          <Navbar>
            <NavItem>
              <NavLink tag={Link} to="/clients">
                <i className="mr-2 fa fa-users"></i> Portal Clients
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/bonds">
                <i className="mr-2 fa fa-file"></i> Lookup Client Request
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/attorneys">
                <i className="mr-2 fa fa-list"></i> Attorney List
              </NavLink>
            </NavItem>
            <NavItem>
              <a className="nav-link" onClick={this.handleLogout}>
                <i className="mr-2 fa fa-sign-out"></i> Log out
              </a>
            </NavItem>
          </Navbar>
        </Nav>
        <div className="background">
          <img src={Bitmaps.background} alt="StoneRidge" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => ({
});
const mapDispatchToProps = dispatch => ({
  logout: bindActionCreators(logout, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SideBar));