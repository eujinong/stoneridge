import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Row, Col,
  FormGroup, Label, Input, Button, CustomInput
} from 'reactstrap';
import { NotificationContainer, NotificationManager } from 'react-notifications';

import Api from '../../apis/app';

import SideBar from '../../components/SideBar';
import AttorneyTable from '../../components/AttorneyTable';

import Bitmaps from '../../theme/Bitmaps';

class Attorney extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
      attorneys: [],
      filtered: [],
      filter: '',
      view: false,
      viewItem: [],
      editable: false,
      editItem: [],
      imagePreviewUrl: '',
      showModal: false,
      email: '',
      name: '',
      validate: true
    }

    this.handleFilter = this.handleFilter.bind(this);
  }

  async componentDidMount() {
    const data = await Api.get('attorneys');
    const { response, body } = data;
    switch (response.status) {
      case 200:
        this.setState({
          attorneys: body.attorneys,
          filtered: body.attorneys
        });
        break;
      default:
        break;
    }
  }

  setNotifications(type, message) {
    switch (type) {
      case 'success':
        NotificationManager.success(message, '', 3000);
        break;
      case 'error':
        NotificationManager.error(message, '', 5000);
        break;
      default:
        break;
    }
  }

  handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  }

  handleFilter(str) {
    const { attorneys } = this.state;

    let filtered = attorneys.filter(
      member => member.email.toUpperCase().includes(str.toUpperCase()) || 
      member.name.toUpperCase().includes(str.toUpperCase())
    );

    this.setState({
      filtered,
      filter: str
    });
  }

  async addAttorney() {
    const {
      email,
      name,
      imagePreviewUrl
    } = this.state;

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validate = re.test(String(email).toLowerCase());

    this.setState({
      validate
    });

    if (validate) {
      const params = {
        email,
        name,
        signature: imagePreviewUrl,
        user_type: 'A'
      }

      const data = await Api.post('add-user', params);
      const { response, body } = data;
      switch (response.status) {
        case 200:
          this.setState({
            attorneys: body.attorneys,
            filtered: body.attorneys,
            imagePreviewUrl: '',
            showModal: false
          });
          this.setNotifications('success', 'New attorney is added successfully.');
          break;
        case 406:
          this.setNotifications('error', body.message);
          break;
        default:
          break;
      }
    }
  }

  handleView(id) {
    const { attorneys } = this.state;

    let viewItem = attorneys.filter(item => item.id == id)[0];
    
    this.setState({
      view: true,
      viewItem: {...viewItem}
    });
  }

  handleEdit(id) {
    const { attorneys } = this.state;

    let editItem = attorneys.filter(item => item.id == id)[0];
    
    this.setState({
      editable: true,
      editItem: {...editItem}
    });
  }

  async updateAttorney() {
    const { editItem, imagePreviewUrl } = this.state;

    const params = {
      email: editItem.email,
      name: editItem.name,
      signature: imagePreviewUrl,
      active: editItem.active
    }

    const data = await Api.put('update-user', params);
      const { response, body } = data;
      switch (response.status) {
        case 200:
          this.setState({
            attorneys: body.attorneys,
            filtered: body.attorneys,
            imagePreviewUrl: '',
            editable: false
          });
          this.setNotifications('success', 'The attorney is updated successfully.');
          break;
        case 406:
          this.setNotifications('error', body.message);
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
      view,
      viewItem,
      editable,
      editItem,
      imagePreviewUrl,
      showModal,
      email,
      name,
      validate
    } = this.state;

    let $imagePreview = null;
    if (imagePreviewUrl != '') {
      $imagePreview = (<img src={imagePreviewUrl} />);
    }

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
            <span className="mb-4 title">Welcome Tender Bond Portal Admin</span>
          </div>

          <div className="panel container">
            <FormGroup row className="mx-1 search-container">
              <div className="d-flex">
                <i className="fa fa-search"></i>
                <Input
                  name="search"
                  placeholder="Type Email or Name for search"
                  value={filter}
                  onChange={(event) => this.handleFilter(event.target.value)}
                />
              </div>
              <a
                className="btn btn-primary pt-2 px-4"
                onClick={() => this.setState({showModal: true})}
              >
                <b>ADD ATTORNEY</b>
              </a>
            </FormGroup>
            <div className="table-responsive">
              <AttorneyTable
                items={filtered}
                onView={this.handleView.bind(this)}
                onEdit={this.handleEdit.bind(this)}
              />
            </div>
          </div>
          <NotificationContainer />
        </div>

        <Modal
          isOpen={showModal}
          centered={true}
          size="md"
        >
          <ModalHeader toggle={() => {this.setState({showModal: false})}}>
            Add Attorney
          </ModalHeader>
          <ModalBody>
            <Label>Name</Label>
            <Input
              type="text"
              onChange={(val) => this.setState({name: val.target.value})}
            />
            {
              validate ? (
                <Label className="mt-3">Email</Label>
              ) : (
                <h5 className="text-danger mt-3">Email is not valid. Please try again.</h5>
              )
            }
            <Input
              className={validate ? '' : 'error'}
              type="text"
              onChange={(val) => this.setState({email: val.target.value})}
            />
            <Label className="mt-3">Select Signature</Label>
            <Input
              className="fileInput" 
              type="file" 
              onChange={(e)=>this.handleImageChange(e)}
            />
            <div className="imagePreview">
              {$imagePreview}
            </div>
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
              disabled={email == '' || name == ''}
              onClick={this.addAttorney.bind(this)}
            >
              Save
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={view}
          centered={true}
          size="md"
        >
          <ModalHeader toggle={() => {this.setState({view: false})}}>
            View Attorney
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="2"><Label>Name</Label></Col>
              <Col sm="10"><Label>{viewItem.name}</Label></Col>
            </Row>
            <hr />
            <Row>
              <Col sm="2"><Label>Email</Label></Col>
              <Col sm="10"><Label>{viewItem.email}</Label></Col>
            </Row>
            <hr />
            <Row>
              <Col sm="2"><Label>Status</Label></Col>
              <Col sm="10">
                <Label>{viewItem.active == 1 ? 'Activate' : 'Deactivate'}</Label>
              </Col>
            </Row>
            <hr />
            <img style={{width: '100%'}} src={viewItem.signature} />
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              disabled={editItem.name == ''}
              onClick={() => {this.setState({view: false})}}
            >
              OK
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={editable}
          centered={true}
          size="md"
        >
          <ModalHeader toggle={() => {this.setState({editable: false})}}>
            Edit Attorney
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label>Name</Label>
              <Input
                type="text"
                value={editItem.name}
                onChange={(val) => {
                  let { editItem } = this.state;
                  editItem.name = val.target.value;

                  this.setState({
                    editItem
                  });
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label>Email</Label>
              <Input type="text" value={editItem.email} disabled />
            </FormGroup>
            <FormGroup>
              <Label className="mt-3">Update Signature</Label>
              <Input
                className="fileInput" 
                type="file" 
                onChange={(e)=>this.handleImageChange(e)}
              />
              <div className="imagePreview">
                {
                  imagePreviewUrl == '' ? (
                    <img style={{width: '100%'}} src={editItem.signature} />
                  ) : (
                    $imagePreview
                  )
                }
              </div>
            </FormGroup>
            <FormGroup>
              <CustomInput
                type="switch"
                id="status"
                label={editItem.active == 1 ? 'Deactive Attorney' : 'Active Attorney'}
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
              disabled={editItem.name == ''}
              onClick={this.updateAttorney.bind(this)}
            >
              Save
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default withRouter(Attorney);