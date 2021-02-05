import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Row, Col,
  FormGroup, Input, Button
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
      filter: '',
      showBond: false,
      bond: [],
      showPDF: false,
      bond_no: '',
      showDelete: false,
      del_id: ''
    }

    this.handleFilter = this.handleFilter.bind(this);
  }

  async componentDidMount() {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user = auth.user;

    this.setState({
      user
    });
    
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

  handleView(id) {
    const { bonds } = this.state;

    let bond = bonds.filter(item => item.id == id)[0];
    
    this.setState({
      showBond: true,
      bond
    });
  }

  handlePrint(bond_no) {
    this.setState({
      showPDF: true,
      bond_no
    });
  }

  handleEdit(id) {
    this.props.history.push('my-bonds/detail', id);
  }

  handleSend() {
    
  }

  handleDelete(id) {
    this.setState({
      showDelete: true,
      del_id: id
    });
  }

  async deleteBond() {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user = auth.user;
    
    const { del_id } = this.state;

    const data = await Api.delete(`bond/${del_id}`);
    const { response, body } = data;
    switch (response.status) {
      case 200:
        this.setState({
          bonds: body.bonds.filter(item => item.client_id == user.id),
          filtered: body.bonds.filter(item => item.client_id == user.id),
          showDelete: false
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
      showBond,
      bond,
      showPDF,
      bond_no,
      showDelete,
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
              {
                (user && user.user_type == 'M') ? (
                  'Hi ' + user.legal + '! Welcome Tender Bond'
                ) : (
                  'Welcome Tender Bond Portal Admin'
                )
              }
            </span>
          </div>

          <div className="panel container">
            <FormGroup row className="mx-1 search-container">
              <div className="d-flex">
                <i className="fa fa-search"></i>
                <Input
                  name="search_bond"
                  placeholder="Type Bond Number for search"
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

        <Modal
          isOpen={showBond}
          centered={true}
          size="lg"
        >
          <ModalHeader toggle={() => {this.setState({showBond: false})}}>
            Tender Bond Request Form: {bond.bond_no}
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="6">
                Insured Legal Name: {bond.legal}
              </Col>
              <Col sm="6">
                Closing Date & Time: {bond.close_date}, {bond.close_time}
              </Col>
            </Row>
            <Row>
              <Col sm="6">
                Obligee (Owner): {bond.obligee}
              </Col>
              <Col sm="6">
                Job Description: {bond.description}
              </Col>
            </Row>
            <Row>
              <Col sm="6">
                Contract No.: {bond.contract_no}
              </Col>
              <Col sm="6">
                Estimated Contract Price: ${bond.contract_price}
              </Col>
            </Row>
            <Row>
              <Col sm="12">
                Bid Bond: {bond.bid_bond == 1 ? 'YES' : 'NO'}
              </Col>
            </Row>
            <Row>
              <Col sm="6">
                Stipulated Amount: ${bond.stipulate_amount}
              </Col>
              <Col sm="6">
                Percentage Amount: {bond.percentage_amount}%
              </Col>
            </Row>
            <Row>
              <Col sm="12">
                Agreement Bond: {bond.agree_bond == 1 ? 'YES' : 'NO'}
              </Col>
            </Row>
            <Row>
              <Col sm="6">
                Performance Bond: {bond.performance_bond}%
              </Col>
              <Col sm="6">
                L&M Payment Bond: {bond.lmpayment_bond}%
              </Col>
            </Row>
            <Row>
              <Col sm="6">
                Acceptance Period: {bond.accept_period} days
              </Col>
              <Col sm="6">
                Schedule: {bond.schedule == 'O' ? 'Own Schedule' : 'Contract Schedule'}
              </Col>
            </Row>
            <Row>
              <Col sm="6">
                Maintenance Warranty: {bond.warranty}
              </Col>
              <Col sm="6">
                Penalty Clause (Liquidated Damages): ${bond.penalty_clause}
              </Col>
            </Row>
            <Row>
              <Col sm="6">
                Project Start Date: {bond.start_date}
              </Col>
              <Col sm="6">
                Project End Date: {bond.end_date}
              </Col>
            </Row>
            <Row>
              <Col sm="12">
                Holdback Amount: ${bond.holdback_amount}
              </Col>
            </Row>
            <Row>
              <Col sm="12">
                Sublet (Type of work & Approximate Value):
              </Col>
            </Row>
            <Row>
              <Col sm="12">
                {bond.sublet}
              </Col>
            </Row>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={showPDF}
          centered={true}
          size="lg"
        >
          <ModalHeader toggle={() => {this.setState({showPDF: false})}}>
            Tender Bond Request Form
          </ModalHeader>
          <ModalBody>
            <iframe
              src={`${window.location.origin}` + '/files/' + bond_no + '.pdf'}
              style={{
                height: '70vh',
                width: '100%'
              }}
            />
          </ModalBody>
        </Modal>

        <Modal
          isOpen={showDelete}
          centered={true}
          size="sm"
        >
          <ModalHeader toggle={() => {this.setState({showDelete: false})}}>
            Tender Bond Request Form
          </ModalHeader>
          <ModalBody>
            Do you want to delete this Bond now?
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              onClick={() => {this.setState({showDelete: false})}}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onClick={this.deleteBond.bind(this)}
            >
              Delete
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default withRouter(Bond);