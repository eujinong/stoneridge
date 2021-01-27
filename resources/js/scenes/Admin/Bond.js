import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  FormGroup, Label, Input
} from 'reactstrap';

import Api from '../../apis/app';

import SideBar from '../../components/SideBar';
import BondTable from '../../components/BondTable';

class Bond extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bonds: [],
      filtered: [],
      filter: ''
    }

    this.handleFilter = this.handleFilter.bind(this);
  }

  async componentDidMount() {
    const data = await Api.get('bonds');
    const { response, body } = data;
    switch (response.status) {
      case 200:
        this.setState({
          bonds: body.bonds,
          filtered: body.bonds
        });
        break;
      default:
        break;
    }
  }

  handleFilter(str) {
    const { bonds } = this.state;

    let filtered = bonds.filter(
      item => item.bond_no.toUpperCase().includes(str.toUpperCase())
    );

    this.setState({
      filtered,
      filter: str
    });
  }

  handleView() {

  }

  handlePrint() {

  }

  handleEdit() {

  }

  handleSend() {
    
  }

  handleDelete() {

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
              <Label className="mr-4" for="search_bond" style={{marginTop: 10}}>
                Search
              </Label>
              <Input
                name="search_bond"
                placeholder="Bond Number"
                value={filter}
                style={{height: 40, width: 250}}
                onChange={(event) => this.handleFilter(event.target.value)}
              />
            </FormGroup>
            <BondTable
              items={filtered}
              onView={this.handleView.bind(this)}
              onPrint={this.handlePrint.bind(this)}
              onEdit={this.handleEdit.bind(this)}
              onSend={this.handleSend.bind(this)}
              onDelete={this.handleDelete.bind(this)}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Bond);