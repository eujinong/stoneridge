import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  FormGroup, Label, Input
} from 'reactstrap';

import Api from '../../apis/app';

import SideBar from '../../components/SideBar';
import BondTable from '../../components/BondTable';

import Bitmaps from '../../theme/Bitmaps';

class Bond extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
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
                <Label className="mr-4 mt-2" for="search_bond">
                  Search
                </Label>
                <Input
                  name="search_bond"
                  placeholder="Bond Number"
                  value={filter}
                  onChange={(event) => this.handleFilter(event.target.value)}
                />
              </div>
            </FormGroup>
            <div className="table-responsive">
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
      </div>
    )
  }
}

export default withRouter(Bond);