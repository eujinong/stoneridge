import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  FormGroup, Label, Input
} from 'reactstrap';

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
      filter: ''
    }

    this.handleFilter = this.handleFilter.bind(this);
  }

  handleFilter() {

  }

  handleView() {

  }

  handleEdit() {
    
  }

  render() {
    const {
      showMenu,
      filtered,
      filter
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
      </div>
    )
  }
}

export default withRouter(Attorney);