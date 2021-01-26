import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import SideBar from '../../components/SideBar';

class Setting extends Component {
  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
  }

  async handleLogout() {
    localStorage.clear();
    this.props.history.push('/logout');
  }

  render() {
    return (
      <div className="d-flex">
        <SideBar />

        <div className="admin-dashboard">
          <div className="d-flex justify-content-between mb-4">
            <h2>Welcome Tender Bond Portal Admin</h2>
            <a className="btn btn-primary pt-2 px-4" onClick={this.handleLogout}>
              <i className="fa fa-sign-out"></i> <b>Log out</b>
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Setting);