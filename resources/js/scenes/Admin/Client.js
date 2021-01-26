import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Label, Input, Button
} from 'reactstrap';

import Api from '../../apis/app';

import SideBar from '../../components/SideBar';
import ClientTable from '../../components/ClientTable';

class Client extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clients: [],
      showModal: false,
      email: '',
      legal: '',
      validate: true,
      errMsg: ''
    }
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
          clients
        });
        break;
      default:
        break;
    }
  }

  async addClient() {
    const { email, legal } = this.state;

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validate = re.test(String(email).toLowerCase());

    this.setState({
      validate
    });

    if (validate) {
      const params = {
        email,
        legal,
        user_type: 'N'
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
      clients,
      showModal,
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
            <ClientTable
              items={clients}
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
            <Label>Normal User</Label>
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