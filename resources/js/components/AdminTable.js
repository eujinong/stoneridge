/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { Component } from 'react';
import {
  Table,
  Pagination,
  Menu
} from 'semantic-ui-react';
import Select from 'react-select';

import _ from 'lodash';

class AdminTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: '',
      column: null,
      items: [],
      data: [],
      direction: null,
      activePage: 1,
      per_page: 10,
      current_perPage: { label: 10, value: 10 },
      pageOptions: [
        { label: 10, value: 10 },
        { label: 20, value: 20 },
        { label: 50, value: 50 }
      ]
    };
    this.handleChangePerPage = this.handleChangePerPage.bind(this);
  }

  componentDidMount() {
    if (this.props.items.length > 0) {
      this.setState({
        activePage: 1
      });
    }
    const { items } = this.props;
    const { per_page } = this.state;
    this.setState({
      items,
      data: items.slice(0, per_page)
    });
  }

  componentWillReceiveProps(props) {
    const { items } = props;
    
    if (this.props.items !== items) {
      if (props.items.length > 0) {
        this.setState({
          activePage: 1
        });
      }
      const { per_page } = this.state;
      this.setState({
        items,
        data: items.slice(0, per_page)
      });
    }
  }

  handlePaginationChange(e, { activePage }) {
    const { items, per_page } = this.state;
    
    this.setState({
      activePage,
      data: items.slice(((activePage - 1) * per_page), activePage * per_page)
    });
  }

  handleSort(clickedColumn) {
    let { items } = this.state;

    const {
      activePage, per_page,
      column, direction
    } = this.state;

    if (column !== clickedColumn) {
      items = _.sortBy(items, [clickedColumn]);

      this.setState({
        column: clickedColumn,
        items,
        data: items.slice(((activePage - 1) * per_page), activePage * per_page),
        direction: 'ascending'
      });
    } else {
      items = items.reverse();

      this.setState({
        items,
        data: items.slice(((activePage - 1) * per_page), activePage * per_page),
        direction: direction === 'ascending' ? 'descending' : 'ascending'
      });
    }
  }

  handleChangePerPage(page_num) {
    const { items } = this.state;
    this.setState({
      activePage: 1,
      current_perPage: page_num,
      per_page: page_num.value,
      data: items.slice(0, page_num.value)
    });
  }

  render() {
    const {
      onView,
      onEdit,
      items
    } = this.props;

    const {
      column,
      direction,
      data,
      activePage,
      per_page,
      pageOptions,
      current_perPage
    } = this.state;

    return (
      <Table sortable celled selectable unstackable singleLine>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="text-center">
              Admin ID
            </Table.HeaderCell>
            <Table.HeaderCell
              className="text-center"
              sorted={column === 'email' ? direction : null}
              onClick={this.handleSort.bind(this, 'email')}
            >
              Email
            </Table.HeaderCell>
            <Table.HeaderCell className="text-center">
              Status
            </Table.HeaderCell>
            <Table.HeaderCell className="text-center">
              Action
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            data && data.length > 0 ? (
              data.map((item, index) => (
                <Table.Row
                  key={index}
                >
                  <Table.Cell className="text-center">{item.id}</Table.Cell>
                  <Table.Cell className="text-center">{item.email}</Table.Cell>
                  <Table.Cell className="text-center">
                    {
                      item.active == 1
                      ?
                        <span
                          className="label"
                          style={{backgroundColor: '#00D994'}}
                        >
                          Activate
                        </span>
                      :
                        <span
                          className="label"
                          style={{backgroundColor: '#FF0000'}}
                        >
                          Deactivate
                        </span>
                    }
                  </Table.Cell>
                  <Table.Cell className="text-center">
                    <a
                      className="mx-2"
                      onClick={() => onView(item.id)}
                    >
                      <i className="fa fa-eye"></i>
                    </a>
                    <a
                      className="mx-2"
                      onClick={() => onEdit(item.id)}
                    >
                      <i className="fa fa-pencil"></i>
                    </a>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell className="text-center" colSpan={4}>
                  <h5>No Super Admins</h5>
                </Table.Cell>
              </Table.Row>
            )
          }
        </Table.Body>
        {
          data.length > 0 && (
            <Table.Footer fullWidth>
              <Table.Row>
                <Table.HeaderCell colSpan="1">
                  <Select
                    name="pageOption"
                    menuPlacement="top"
                    classNamePrefix="react-select"
                    placeholder="Per Page"
                    defaultValue={pageOptions[0]}
                    value={current_perPage}
                    options={pageOptions}
                    getOptionValue={option => option.label}
                    getOptionLabel={option => option.value}
                    onChange={(num) => {
                      this.handleChangePerPage(num);
                    }}
                  />
                </Table.HeaderCell>
                <Table.HeaderCell colSpan="3">
                  <Menu floated="right" pagination>
                    <Pagination
                      activePage={activePage}
                      onPageChange={this.handlePaginationChange.bind(this)}
                      totalPages={Math.ceil(items.length / per_page)}
                    />
                  </Menu>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          )
        }
      </Table>
    );
  }
}

AdminTable.defaultProps = {
  onView: () => {},
  onEdit: () => {}
};

export default AdminTable;