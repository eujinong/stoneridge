import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  FormGroup, Label, Input, Button
} from 'reactstrap';

import Api from '../../apis/app';

import SideBar from '../../components/SideBar';
import ClientTable from '../../components/ClientTable';

class Client extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clients: [],
      filtered: [],
      filter: '',
      showModal: false,
      user_type: 'A',
      email: '',
      legal: '',
      validate: true,
      errMsg: ''
    }

    this.handleFilter = this.handleFilter.bind(this)
  }

  async componentDidMount() {
    const data = await Api.get('clients');
    const { response, body } = data;
    switch (response.status) {
      case 200:
        const clients = body.clients;
        for (let i = 0; i < clients.length; i++) {
          let id = '' + clients[i].id;
          
          let str = '';
          for (let j = 0; j < 5 - id.length; j++) {
            str += '0';
          }

          clients[i].id = str + id;
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

  async addClient() {
    const { user_type, email, legal } = this.state;

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validate = re.test(String(email).toLowerCase());

    this.setState({
      validate
    });

    if (validate) {
      const params = {
        email,
        legal,
        user_type
      }

      const data = await Api.post('register', params);
      const { response, body } = data;
      switch (response.status) {
        case 200:
          const clients = body.clients;
          for (let i = 0; i < clients.length; i++) {
            let id = '' + clients[i].id;
            
            let str = '';
            for (let j = 0; j < 5 - id.length; j++) {
              str += '0';
            }

            clients[i].id = str + id;
          }

          this.setState({
            clients,
            showModal: false
          });
          break;
        case 406:
          this.setState({
            errMsg: body.message
          });
          break;
        default:
          break;
      }
    }
  }

  render() {
    const {
      filtered,
      filter,
      showModal,
      user_type,
      email,
      legal,
      validate,
      errMsg
    } = this.state;

    return (
      <div className="d-flex">
        <SideBar />

        <div className="admin-dashboard">
          <div className="d-flex justify-content-between mb-4">
            <h2>Welcome Tender Bond Portal Admin</h2>
            <a
              className="btn btn-primary pt-2 px-4"
              onClick={() => this.setState({showModal: true})}
            >
              <b>ADD CLIENT</b>
            </a>
          </div>

          <div className="panel">
            <FormGroup row className="ml-2 search-container">
              <Label className="mt-2 mr-4" for="search_name">Search</Label>
              <Input
                name="search_name"
                placeholder="Email or Legal Name"
                value={filter}
                style={{height: 40, width: 250}}
                onChange={(event) => this.handleFilter(event.target.value)}
              />
            </FormGroup>
            <ClientTable
              items={filtered}
            />
          </div>
        </div>

        <Modal
          className="add-client"
          isOpen={showModal}
          centered={true}
          size="md"
        >
          <ModalHeader toggle={() => {this.setState({showModal: false})}}>
            Add Client
          </ModalHeader>
          <ModalBody>
            {
              errMsg != '' && (
                <h4 className="text-danger text-center">{errMsg}</h4>
              )
            }
            <h6 className="mb-3">User Type</h6>
            <FormGroup check inline>
              <Label check>
                <Input
                  type="radio"
                  name="radio2"
                  checked={user_type == 'A'}
                  onChange={() => this.setState({user_type: 'A'})}
                />
                {' '}Admin User
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Label check>
                <Input
                  type="radio"
                  name="radio1"
                  checked={user_type == 'N'}
                  onChange={() => this.setState({user_type: 'N'})}
                />
                {' '}Normal User
              </Label>
            </FormGroup>
            <hr />
            {
              validate ? (
                <Label>Email</Label>
              ) : (
                <h5 className="text-danger">Email is not valid. Please try again.</h5>
              )
            }
            <Input
              className={validate ? '' : 'error'}
              type="text"
              onChange={(val) => this.setState({email: val.target.value})}
            />
            <Label className="mt-3">Legal Name</Label>
            <Input
              type="text"
              onChange={(val) => this.setState({legal: val.target.value})}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              onClick={() => {this.setState({showModal: false})}}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              disabled={email == '' || legal == ''}
              onClick={this.addClient.bind(this)}
            >
              Save
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default withRouter(Client);