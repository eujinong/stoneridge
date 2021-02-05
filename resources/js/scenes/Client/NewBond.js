import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Row, Col, Button,
  Modal, ModalHeader, ModalBody,
  Form, FormGroup,
  InputGroup, InputGroupAddon,
  Label, Input
} from 'reactstrap';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Api from '../../apis/app';

import SideBar from '../../components/SideBar';

import Bitmaps from '../../theme/Bitmaps';

class NewBond extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
      showPDF: false,
      bond_no: '',
      closing: new Date(),
      close_date: '',
      close_time: '',
      obligee: '',
      description: '',
      contract_no: '',
      contract_price: 0,
      bid_bond: false,
      stipulate_amount: 0,
      percentage_amount: 0,
      agree_bond: false,
      performance_bond: 0,
      lmpayment_bond: 0,
      accept_period: 30,
      schedule: 'O',
      warranty: '',
      penalty_clause: 0,
      start: new Date(),
      start_date: '',
      end: new Date(),
      end_date: '',
      holdback_amount: 0,
      sublet: '',
      user: null
    }
  }

  componentDidMount() {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const user = auth.user;

    const close_date = this.formatDate(new Date());
    const close_time = this.formatTime(new Date());
    const start_date = this.formatDate(new Date());
    const end_date = this.formatDate(new Date());

    this.setState({
      close_date,
      close_time,
      start_date,
      end_date,
      user
    });
  }

  formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }

  formatTime(date) {
    let d = new Date(date),
        hour = '' + d.getHours(),
        min = '' + d.getMinutes();

    if (hour.length < 2)
        hour = '0' + hour;
    if (min.length < 2)
        min = '0' + min;

    return [hour, min, '00'].join(':');
  }

  handleClosing(date) {
    const close_date = this.formatDate(date);
    const close_time = this.formatTime(date);

    this.setState({
      closing: date,
      close_date,
      close_time
    });
  }

  handleStartDate(date) {
    const start_date = this.formatDate(date);

    this.setState({
      start: date,
      start_date,
      end: date,
      end_date: start_date
    });
  }

  handleEndDate(date) {
    const end_date = this.formatDate(date);

    this.setState({
      end: date,
      end_date
    });
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

  async handleSave(mode) {
    const {
      close_date, close_time,
      obligee, description,
      contract_no, contract_price,
      bid_bond, agree_bond,
      stipulate_amount, percentage_amount,
      performance_bond, lmpayment_bond,
      accept_period, schedule,
      warranty, penalty_clause,
      start_date, end_date,
      holdback_amount, sublet,
      user
    } = this.state;
    
    const params = {
      mode,
      client_id: user.id,
      bid_bond: bid_bond ? 1 : 0,
      agree_bond: agree_bond ? 1 : 0,
      type: agree_bond && bid_bond ? 'S' : (bid_bond ? 'B' : 'A'),
      close_date, close_time,
      obligee, description,
      contract_no, contract_price,
      stipulate_amount, percentage_amount,
      performance_bond, lmpayment_bond,
      accept_period, schedule,
      warranty, penalty_clause,
      start_date, end_date,
      holdback_amount, sublet,
      status: 'pending'
    }

    const data = await Api.post('bond', params);
    const { response, body } = data;
    switch (response.status) {
      case 200:
        this.setState({
          showPDF: mode == 'print' ? true : false,
          bond_no: body.bond_no
        });
        this.setNotifications('success', body.message);
        break;
      case 500:
        this.setNotifications('error', 'Interal Server Error!');
      default:
        break;
    }
  }

  render() {
    const {
      showMenu,
      showPDF,
      bond_no,
      closing,
      obligee, description,
      contract_no, contract_price,
      bid_bond, stipulate_amount, percentage_amount,
      agree_bond, performance_bond, lmpayment_bond,
      accept_period, schedule,
      warranty, penalty_clause,
      start, end,
      holdback_amount, sublet,
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
            <span className="title">
              Hi {user && user.legal}! Welcome Tender Bond
            </span>
          </div>
          
          <div className="panel container">
            <Form>
              <Row>
                <Col sm={12} md={6}>
                  <FormGroup>
                    <Label for="legal">Insured Legal Name:</Label>
                    <Input
                      type="text"
                      name="legal"
                      value={user && user.legal ? user.legal : ''}
                      disabled
                    />
                  </FormGroup>
                </Col>
                <Col sm={12} md={6}>
                  <FormGroup>
                    <Label>Closing Date & Time:</Label>
                    <DatePicker
                      selected={closing}
                      onChange={(date) => this.handleClosing(date)}
                      showTimeSelect
                      dateFormat="Pp"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm={12} md={6}>
                  <FormGroup>
                    <Label for="obligee">Obligee (Owner):</Label>
                    <Input
                      type="text"
                      name="obligee"
                      value={obligee}
                      onChange={(val) => this.setState({obligee: val.target.value})}
                    />
                  </FormGroup>
                </Col>
                <Col sm={12} md={6}>
                  <FormGroup>
                    <Label for="description">Job Description:</Label>
                    <Input
                      type="text"
                      name="description"
                      value={description}
                      onChange={(val) => this.setState({description: val.target.value})}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm={12} md={6}>
                  <FormGroup>
                    <Label for="contract_no">Contract No.:</Label>
                    <Input
                      type="text"
                      name="contract_no"
                      value={contract_no}
                      onChange={(val) => this.setState({contract_no: val.target.value})}
                    />
                  </FormGroup>
                </Col>
                <Col sm={12} md={6}>
                  <FormGroup>
                    <Label for="contract_price">Estimated Contract Price:</Label>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                      <Input
                        type="number"
                        name="contract_price"
                        value={contract_price}
                        onChange={(val) => this.setState({contract_price: val.target.value})}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <FormGroup>
                    <Label for="bid_bond" className="mr-2">Bid Bond:</Label>
                    <FormGroup check inline>
                      <Label check>
                        <Input
                          type="checkbox"
                          checked={bid_bond}
                          onChange={() => this.setState({bid_bond: !bid_bond})}
                        /> Yes
                      </Label>
                    </FormGroup>
                    <FormGroup check inline>
                      <Label check>
                        <Input
                          type="checkbox"
                          checked={!bid_bond}
                          onChange={() => this.setState({bid_bond: !bid_bond})}
                        /> No
                      </Label>
                    </FormGroup>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm={12} md={6}>
                  <FormGroup>
                    <Label for="stipulate_amount">Stipulated Amount:</Label>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                      <Input
                        type="number"
                        name="stipulate_amount"
                        value={stipulate_amount}
                        onChange={(val) => this.setState({stipulate_amount: val.target.value})}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col sm={12} md={6}>
                  <FormGroup>
                    <Label for="percentage_amount">Percentage Amount:</Label>
                    <InputGroup>
                      <Input
                        type="number"
                        name="percentage_amount"
                        value={percentage_amount}
                        onChange={(val) => this.setState({percentage_amount: val.target.value})}
                      />
                      <InputGroupAddon addonType="append">%</InputGroupAddon>
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <FormGroup>
                    <Label for="agree_bond" className="mr-2">Agreement to Bond:</Label>
                    <FormGroup check inline>
                      <Label check>
                        <Input
                          type="checkbox"
                          checked={agree_bond}
                          onChange={() => this.setState({agree_bond: !agree_bond})}
                        /> Yes
                      </Label>
                    </FormGroup>
                    <FormGroup check inline>
                      <Label check>
                        <Input
                          type="checkbox"
                          checked={!agree_bond}
                          onChange={() => this.setState({agree_bond: !agree_bond})}
                        /> No
                      </Label>
                    </FormGroup>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm={12} md={6}>
                  <FormGroup>
                    <Label for="performance_bond">Performance Bond:</Label>
                    <InputGroup>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        name="performance_bond"
                        value={performance_bond}
                        onChange={(val) => this.setState({performance_bond: val.target.value})}
                      />
                      <InputGroupAddon addonType="append">%</InputGroupAddon>
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col sm={12} md={6}>
                  <FormGroup>
                    <Label for="lmpayment_bond">L&M Payment Bond:</Label>
                    <InputGroup>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        name="lmpayment_bond"
                        value={lmpayment_bond}
                        onChange={(val) => this.setState({lmpayment_bond: val.target.value})}
                      />
                      <InputGroupAddon addonType="append">%</InputGroupAddon>
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm={12} md={6}>
                  <FormGroup>
                    <Label for="accept_period">Acceptance Period:</Label>
                    <div>
                      <FormGroup check inline>
                        <Label check>
                          <Input
                            type="checkbox"
                            checked={accept_period == 30}
                            onChange={() => this.setState({accept_period: 30})}
                          /> 30 days
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Label check>
                          <Input
                            type="checkbox"
                            checked={accept_period == 60}
                            onChange={() => this.setState({accept_period: 60})}
                          /> 60 days
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Label check>
                          <Input
                            type="checkbox"
                            checked={accept_period == 90}
                            onChange={() => this.setState({accept_period: 90})}
                          /> 90 days
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Label check>
                          <Input
                            type="checkbox"
                            checked={accept_period == 120}
                            onChange={() => this.setState({accept_period: 120})}
                          /> 120 days
                        </Label>
                      </FormGroup>
                    </div>
                  </FormGroup>
                  <hr />
                </Col>
                <Col sm={12} md={6}>
                  <FormGroup>
                    <Label for="schedule">Schedule:</Label>
                    <div>
                      <FormGroup check inline>
                        <Label check>
                          <Input
                            type="checkbox"
                            checked={schedule == 'O'}
                            onChange={() => this.setState({schedule: 'O'})}
                          /> Own Schedule
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Label check>
                          <Input
                            type="checkbox"
                            checked={schedule == 'C'}
                            onChange={() => this.setState({schedule: 'C'})}
                          /> Contract Schedule
                        </Label>
                      </FormGroup>
                    </div>
                  </FormGroup>
                  <hr />
                </Col>
              </Row>
              <Row>
                <Col sm={12} md={6}>
                  <FormGroup>
                    <Label for="warranty">Maintenance Warranty:</Label>
                    <Input
                      type="text"
                      name="warranty"
                      value={warranty}
                      onChange={(val) => this.setState({warranty: val.target.value})}
                    />
                  </FormGroup>
                </Col>
                <Col sm={12} md={6}>
                  <FormGroup>
                    <Label for="penalty_clause">
                      Penalty Clause (Liquidated Damages):
                    </Label>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                      <Input
                        type="number"
                        name="penalty_clause"
                        value={penalty_clause}
                        onChange={(val) => this.setState({penalty_clause: val.target.value})}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm={12} md={3}>
                  <FormGroup>
                    <Label for="start_date">Project Start Date:</Label>
                    <DatePicker
                      selected={start}
                      onChange={(date) => this.handleStartDate(date)}
                    />
                  </FormGroup>
                </Col>
                <Col sm={12} md={3}>
                  <FormGroup>
                    <Label for="end_date">Project End Date:</Label>
                    <DatePicker
                      minDate={start}
                      selected={end}
                      onChange={(date) => this.handleEndDate(date)}
                    />
                  </FormGroup>
                </Col>
                <Col sm={12} md={6}>
                  <FormGroup>
                    <Label for="holdback_amount">Holdback Amount:</Label>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                      <Input
                        type="number"
                        name="holdback_amount"
                        value={holdback_amount}
                        onChange={(val) => this.setState({holdback_amount: val.target.value})}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <FormGroup>
                    <Label for="sublet">
                      Sublet (Type of work & Approximate Value):
                    </Label>
                    <Input
                      type="textarea"
                      name="sublet"
                      value={sublet}
                      onChange={(val) => this.setState({sublet: val.target.value})}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm={12} className="text-center">
                  <Button
                    className="btn btn-primary px-4"
                    onClick={this.handleSave.bind(this, 'save')}
                  >
                    <i className="fa fa-save mr-2"></i> Save
                  </Button>
                  <Button
                    className="btn btn-success px-4 mx-2"
                    onClick={this.handleSave.bind(this, 'print')}
                  >
                    <i className="fa fa-print mr-2"></i> Print
                  </Button>
                  <Button
                    className="btn btn-info px-4"
                    onClick={this.handleSave.bind(this, 'send')}
                  >
                    <i className="fa fa-envelope mr-2"></i> Send
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
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
        <NotificationContainer />
      </div>
    )
  }
}

export default withRouter(NewBond);