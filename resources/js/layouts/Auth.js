import React, { Component } from 'react';

import Bitmaps from '../theme/Bitmaps';

class Auth extends Component {
  render() {
    const {
      form
    } = this.props;

    return (
      <div className="site-intro">
        <div className="site-intro-box">
          <div className="intro-box-content">
            <img src={Bitmaps.logo} alt="StoneRidge" />
            {form}
          </div>
          <div className="intro-box-footer">
            <span>StoneRidge, Copyright ©2021</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Auth;
