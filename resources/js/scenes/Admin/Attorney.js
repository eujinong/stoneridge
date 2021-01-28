import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  FormGroup, Label, Input, Button
} from 'reactstrap';

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
      imagePreviewUrl: '',
      showModal: false,
      email: '',
      legal: '',
      validate: true,
      errMsg: ''
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
      member.legal.toUpperCase().includes(str.toUpperCase())
    );

    this.setState({
      filtered,
      filter: str
    });
  }

  async addAttorney() {
    const {
      email,
      legal,
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
        legal,
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

  handleView() {

  }

  handleEdit() {
    
  }

  render() {
    const {
      showMenu,
      filtered,
      filter,
      imagePreviewUrl,
      showModal,
      email,
      legal,
      validate,
      errMsg
    } = this.state;

    let $imagePreview = null;
    if (imagePreviewUrl) {
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

          <span className="mb-4 title">Welcome Tender Bond Portal Admin</span>

          <div className="panel">
            <FormGroup row className="mx-1 search-container">
              <div className="d-flex">
                <Label className="mr-4 mt-2" for="search">
                  Search
                </Label>
                <Input
                  name="search"
                  placeholder="Email or Name"
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
        </div>

        <Modal
          className="add-client"
          isOpen={showModal}
          centered={true}
          size="md"
        >
          <ModalHeader toggle={() => {this.setState({showModal: false})}}>
            Add Attorney
          </ModalHeader>
          <ModalBody>
            {
              errMsg != '' && (
                <h4 className="text-danger text-center">{errMsg}</h4>
              )
            }
            <Label>Name</Label>
            <Input
              type="text"
              onChange={(val) => this.setState({legal: val.target.value})}
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
              disabled={email == '' || legal == ''}
              onClick={this.addAttorney.bind(this)}
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