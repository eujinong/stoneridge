import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import SideBar from '../../components/SideBar';

class Attorney extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="d-flex">
        <SideBar />

        <div className="admin-dashboard">

        </div>
      </div>
    )
  }
}

export default withRouter(Attorney);