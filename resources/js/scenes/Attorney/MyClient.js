import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  FormGroup, Input
} from 'reactstrap';

import Api from '../../apis/app';

import SideBar from '../../components/SideBar';
import ClientTable from '../../components/ClientTable';

import Bitmaps from '../../theme/Bitmaps';

class MyClient extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
      clients: [],
      filtered: [],
      filter: '',
      user: null
    }

    this.handleFilter = this.handleFilter.bind(this)
  }

  async componentDidMount() {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user = auth.user;

    this.setState({
      user
    });

    const data = await Api.get('clients');
    const { response, body } = data;
    switch (response.status) {
      case 200:
        let clients = body.clients.filter(client => client.attorney == user.id);

        for (let i = 0; i < clients.length; i++) {
          let id = '' + clients[i].id;
          
          let str = '';
          for (let j = 0; j < 5 - id.length; j++) {
            str += '0';
          }

          clients[i].index = str + id;
        }

        this.setState({
          clients,
          filtered: clients
        });
        break;
      default:
        break;
    }
  }

  handleFilter(str) {
    const { clients } = this.state;

    let filtered = clients.filter(
      member => member.email.toUpperCase().includes(str.toUpperCase()) || 
      member.legal.toUpperCase().includes(str.toUpperCase())
    );

    this.setState({
      filtered,
      filter: str
    });
  }

  render() {
    const {
      showMenu,
      filtered,
      filter,
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
            <span className="mb-4 title">
              Hi {user && user.legal}! Welcome Tender Bond
            </span>
          </div>

          <div className="panel container">
            <FormGroup row className="mx-1 search-container">
              <div>
                <i className="fa fa-search"></i>
                <Input
                  name="search_name"
                  placeholder="Type Email or Legal Name for search"
                  value={filter}
                  onChange={(event) => this.handleFilter(event.target.value)}
                />
              </div>
            </FormGroup>
            <div className="table-responsive">
              <ClientTable
                edit={false}
                items={filtered}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(MyClient);