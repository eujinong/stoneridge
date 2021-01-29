import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Label } from 'reactstrap';
import { Table } from 'semantic-ui-react';

import SideBar from '../components/SideBar';

import Bitmaps from '../theme/Bitmaps';

class Profile extends Component {
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

    let id = '' + user.id;
          
    let str = '';
    for (let j = 0; j < 5 - id.length; j++) {
      str += '0';
    }

    user.id = str + id;

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
          
          {
            user && (
              <div className="panel">
                <div className="table-responsive">
                  <Table unstackable singleLine>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell className="text-center">Client Number</Table.Cell>
                        <Table.Cell className="text-center">{user.id}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell className="text-center">Name</Table.Cell>
                        <Table.Cell className="text-center">{user.legal}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell className="text-center">Email</Table.Cell>
                        <Table.Cell className="text-center">{user.email}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell className="text-center">Bid Bond</Table.Cell>
                        <Table.Cell className="text-center">0</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell className="text-center">Agreement Bond</Table.Cell>
                        <Table.Cell className="text-center">0</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell className="text-center">Profile Status</Table.Cell>
                        <Table.Cell className="text-center">
                          {
                            user.active == 1
                            ?
                              <span
                                className="label"
                                style={{backgroundColor: '#00D994'}}
                              >
                                Active
                              </span>
                            :
                              <span
                                className="label"
                                style={{backgroundColor: '#FF0000'}}
                              >
                                Pending
                              </span>
                          }
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </div>
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

export default withRouter(Profile);