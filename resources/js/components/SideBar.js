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

    this.state = {
      user_type: ''
    }

    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user_type = auth.user.user_type;
    
    this.setState({
      user_type
    });
  }

  async handleLogout() {
    await this.props.logout();
    this.props.history.push('/');
  }

  render() {
    const { user_type } = this.state;

    return (
      <div className="admin-sidebar">
        <div className="text-center" style={{width: 280}}>
          <img src={Bitmaps.logo} alt="StoneRidge" />
        </div>
        <div className="background">
          <img src={Bitmaps.sidebar} alt="StoneRidge" />
        </div>
        <Nav>
          {
            (user_type == 'S' || user_type == 'M') && (
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
                {
                  user_type == 'S' && (
                    <NavItem>
                      <NavLink tag={Link} to="/attorneys">
                        <i className="mr-2 fa fa-list"></i> Attorney List
                      </NavLink>
                    </NavItem>
                  )
                }
                <NavItem>
                  <a className="nav-link" onClick={this.handleLogout}>
                    <i className="mr-2 fa fa-sign-out"></i> Log out
                  </a>
                </NavItem>
              </Navbar>
            )
          }
          {
            user_type == 'N' && (
              <Navbar>
                <NavItem>
                  <NavLink tag={Link} to="/profile">
                    <i className="mr-2 fa fa-user"></i> My Profile
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/new-bond">
                    <i className="mr-2 fa fa-plus-square"></i> New Bond Request
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/my-bonds">
                    <i className="mr-2 fa fa-list"></i> Lookup Request
                  </NavLink>
                </NavItem>
                <NavItem>
                  <a className="nav-link" onClick={this.handleLogout}>
                    <i className="mr-2 fa fa-sign-out"></i> Log out
                  </a>
                </NavItem>
              </Navbar>
            )
          }
          {
            user_type == 'A' && (
              <Navbar>
                <NavItem>
                  <NavLink tag={Link} to="/profile">
                    <i className="mr-2 fa fa-user"></i> My Profile
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/my-clients">
                    <i className="mr-2 fa fa-users"></i> My Clients
                  </NavLink>
                </NavItem>
                <NavItem>
                  <a className="nav-link" onClick={this.handleLogout}>
                    <i className="mr-2 fa fa-sign-out"></i> Log out
                  </a>
                </NavItem>
              </Navbar>
            )
          }
        </Nav>
        <div className="footer text-center">
          <h6>StoneRidge</h6>
          <h6>©2021</h6>
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