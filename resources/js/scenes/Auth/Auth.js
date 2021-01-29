import React, {
  Component, Fragment
} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import QueryString from 'qs';
import {
  Form, FormGroup, Input, Button, Alert
} from 'reactstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Layout from '../../layouts/Auth';

import Api from '../../apis/app';
import {
  login
} from '../../actions/common';
import AppHelper from '../../helpers/AppHelper';

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ''
    };
  }

  componentDidMount() {
    const search = QueryString.parse(this.props.location.search, { ignoreQueryPrefix: true });
    
    this.setState({
      email: search.email
    });
  }

  async handleSubmit(values, bags) {
    const { email } = this.state;

    values.email = email;

    const data = await Api.post('auth', values);
    const { response, body } = data;
    switch (response.status) {
      case 422:
        bags.setErrors(body.data);
        break;
      case 406:
        bags.setStatus(AppHelper.getStatusAlertData(body));
        break;
      case 200:
        this.login(body.data);
        break;
      default:
        break;
    }
    bags.setSubmitting(false);
  }

  async login(auth) {
    await this.props.login(auth);
    
    if (auth.user.user_type == 'S' || auth.user.user_type == 'M') {
      this.props.history.push('/clients');
    }

    if (auth.user.user_type == 'N' || auth.user.user_type == 'A') {
      this.props.history.push('/profile');
    }
  }

  render() {
    return (
      <Layout
        form={(
          <Formik
            initialValues={{
              password: ''
            }}
            validationSchema={
              Yup.object().shape({
                password: Yup.string().min(6, 'Password has to be longer than 6 characters!').required('Password is required!')
              })
            }
            onSubmit={this.handleSubmit.bind(this)}
            render={({
              values,
              errors,
              status,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting
            }) => (
              <Form className="intro-box-form-field" onSubmit={handleSubmit}>
                {status && <Alert {...status} />}
                {
                  !!errors.password && (
                    <ul className="alert alert-danger">
                      {touched.password && !!errors.password && (
                        <li>
                          {touched.password && errors.password}
                        </li>
                      )}
                    </ul>
                  )
                }
                <div className="form-fields">
                  <FormGroup>
                    <Input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={touched.password && !!errors.password}
                    />
                    <i className="fa fa-fingerprint" />
                  </FormGroup>
                </div>
                <div className="form-links">
                  <FormGroup className="text-center">
                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      color="success"
                      className="btn-lg px-5 py-1"
                    >
                      {
                        isSubmitting && (
                          <Fragment>
                            <span className="fa fa-spinner fa-spin" />
                            &nbsp;&nbsp;
                          </Fragment>
                        )
                      }
                      Log in
                    </Button>
                  </FormGroup>
                </div>
              </Form>
            )}
          />
        )}
      />
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  login: bindActionCreators(login, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Auth));
