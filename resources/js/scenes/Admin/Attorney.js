import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  FormGroup, Label, Input
} from 'reactstrap';

import SideBar from '../../components/SideBar';
import AttorneyTable from '../../components/AttorneyTable';

class Attorney extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
      filtered,
      filter
    } = this.state;

    return (
      <div className="d-flex">
        <SideBar />

        <div className="admin-dashboard">
          <div className="d-flex justify-content-between mb-4">
            <h2>Welcome Tender Bond Portal Admin</h2>
          </div>

          <div className="panel">
            <FormGroup row className="ml-2 search-container">
              <Label className="mr-4" for="search" style={{marginTop: 10}}>
                Search
              </Label>
              <Input
                name="search"
                placeholder="Email or Name"
                value={filter}
                style={{height: 40, width: 250}}
                onChange={(event) => this.handleFilter(event.target.value)}
              />
            </FormGroup>
            <AttorneyTable
              items={filtered}
              onView={this.handleView.bind(this)}
              onEdit={this.handleEdit.bind(this)}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Attorney);