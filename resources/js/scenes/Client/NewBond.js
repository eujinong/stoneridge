import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import SideBar from '../../components/SideBar';

import Bitmaps from '../../theme/Bitmaps';

class NewBond extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
      user: null
    }
  }

  componentDidMount() {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user = auth.user;

    this.setState({
      user
    });
  }

  render() {
    const {
      showMenu,
      user
    } = this.state;

    return (
      <div className={showMenu ? 'd-flex show-menu' : 'd-flex hide-menu'}>
        <SideBar />

        <div className="admin-dashboard">
          <div className="text-center logo">
            <img src={Bitmaps.logo} alt="StoneRidge" />
          </div>
          <a className="toggle-menu" onClick={() => this.setState({showMenu: !showMenu})}>
            <i className="fa fa-bars"></i>
          </a>

          <span className="mb-4 title">
            Hi {user && user.legal}! Welcome Tender Bond
          </span>
          
          <div className="panel">
                
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(NewBond);