import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  FormGroup, Label, Input, Button, CustomInput
} from 'reactstrap';

import Api from '../../apis/app';

import SideBar from '../../components/SideBar';
import ClientTable from '../../components/ClientTable';

import Bitmaps from '../../theme/Bitmaps';

class Client extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
      clients: [],
      filtered: [],
      filter: '',
      editable: false,
      editItem: [],
      showModal: false,
      user_type: 'M',
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
        signature: null,
        user_type
      }

      const data = await Api.post('add-user', params);
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
            filtered: clients,
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

  async handleEditModal(id) {
    const { clients } = this.state;

    let editItem = clients.filter(item => item.id == id)[0];
    
    this.setState({
      editable: true,
      editItem: {...editItem}
    });
  }

  async updateClient() {
    const { editItem } = this.state;

    const params = {
      email: editItem.email,
      legal: editItem.legal,
      signature: null,
      active: editItem.active
    }

    const data = await Api.put('update-user', params);
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
            filtered: clients,
            editable: false
          });
          break;
        default:
          break;
      }
  }

  render() {
    const {
      showMenu,
      filtered,
      filter,
      editable,
      editItem,
      showModal,
      user_type,
      email,
      legal,
      validate,
      errMsg
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

          <span className="mb-4 title">Welcome Tender Bond Portal Admin</span>

          <div className="panel">
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
              <a
                className="btn btn-primary pt-2 px-4"
                onClick={() => this.setState({showModal: true})}
              >
                <b>ADD CLIENT</b>
              </a>
            </FormGroup>
            <div className="table-responsive">
              <ClientTable
                edit={true}
                items={filtered}
                onSelect={this.handleEditModal.bind(this)}
              />
            </div>
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
                  checked={user_type == 'M'}
                  onChange={() => this.setState({user_type: 'M'})}
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

        <Modal
          className="add-client"
          isOpen={editable}
          centered={true}
          size="md"
        >
          <ModalHeader toggle={() => {this.setState({editable: false})}}>
            Edit Client
          </ModalHeader>
          <ModalBody>
            <h6 className="mb-3">User Type</h6>
            <FormGroup check inline>
              <Label check>
                <Input type="radio" checked={editItem.user_type == 'M'} disabled />
                {' '}Admin User
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Label check>
                <Input type="radio" checked={editItem.user_type == 'N'} disabled />
                {' '}Normal User
              </Label>
            </FormGroup>
            <hr />
            <FormGroup>
              <Label>Email</Label>
              <Input type="text" value={editItem.email} disabled />
            </FormGroup>
            <FormGroup>
              <Label>Legal Name</Label>
              <Input
                type="text"
                value={editItem.legal}
                onChange={(val) => {
                  let { editItem } = this.state;
                  editItem.legal = val.target.value;

                  this.setState({
                    editItem
                  });
                }}
              />
            </FormGroup>
            <FormGroup>
              <CustomInput
                type="switch"
                id="status"
                label={editItem.active == 1 ? 'Deactive Client' : 'Active Client'}
                checked={editItem.active == 1 ? true : false}
                onChange={(val) => {
                  let { editItem } = this.state;
                  editItem.active = val.target.checked ? 1 : 0;

                  this.setState({
                    editItem
                  });
                }}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              onClick={() => {this.setState({editable: false})}}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              disabled={editItem.legal == ''}
              onClick={this.updateClient.bind(this)}
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