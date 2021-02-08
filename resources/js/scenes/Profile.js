import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Table } from 'semantic-ui-react';

import Api from '../apis/app';

import SideBar from '../components/SideBar';

import Bitmaps from '../theme/Bitmaps';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
      agree: 0,
      bid: 0,
      both: 0,
      user: null
    }
  }

  async componentDidMount() {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user = auth.user;

    const data = await Api.get('bonds');
    const { response, body } = data;
    switch (response.status) {
      case 200:
        const bonds = body.bonds.filter(item => item.client_id == user.id);
        
        this.setState({
          agree: bonds.filter(item => item.type == 'A').length,
          bid: bonds.filter(item => item.type == 'B').length,
          both: bonds.filter(item => item.type == 'S').length
        });
        break;
      default:
        break;
    }

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
      agree, bid, both,
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

          <div className="mb-2 container">
            <span className="title">
              Hi {user && user.legal}! Welcome Tender Bond
            </span>
          </div>
          
          {
            user && (
              <div className="panel container">
                <div className="table-responsive">
                  {
                    user.user_type == 'N' && (
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
                            <Table.Cell className="text-center">Agreement to Bond</Table.Cell>
                            <Table.Cell className="text-center">{agree}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell className="text-center">Bid Bond</Table.Cell>
                            <Table.Cell className="text-center">{bid}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell className="text-center">Both</Table.Cell>
                            <Table.Cell className="text-center">{both}</Table.Cell>
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
                                    Activate
                                  </span>
                                :
                                  <span
                                    className="label"
                                    style={{backgroundColor: '#FF0000'}}
                                  >
                                    Deactivate
                                  </span>
                              }
                            </Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      </Table>
                    )
                  }
                  {
                    user.user_type == 'A' && (
                      <Table unstackable singleLine>
                        <Table.Body>
                          <Table.Row>
                            <Table.Cell className="text-center">Name</Table.Cell>
                            <Table.Cell className="text-center">{user.legal}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell className="text-center">Email</Table.Cell>
                            <Table.Cell className="text-center">{user.email}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell className="text-center">Clients</Table.Cell>
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
                                    Activate
                                  </span>
                                :
                                  <span
                                    className="label"
                                    style={{backgroundColor: '#FF0000'}}
                                  >
                                    Deactivate
                                  </span>
                              }
                            </Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      </Table>
                    )
                  }
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