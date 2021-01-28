import React, {
  Component, Fragment
} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

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

class Login extends Component {
  async handleSubmit(values, bags) {
    const data = await Api.post('login', values);
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
    
    this.props.history.push('/clients');
  }

  render() {
    return (
      <Layout
        form={(
          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            validationSchema={
              Yup.object().shape({
                email: Yup.string().required('Email is required!'),
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
                  (!!errors.email || !!errors.password) && (
                    <ul className="alert alert-danger">
                      {touched.email && !!errors.email && (
                        <li>
                          {touched.email && errors.email}
                        </li>
                      )}
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
                      type="text"
                      name="email"
                      id="email"
                      placeholder="Email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={touched.email && !!errors.email}
                    />
                    <i className="far fa-user" />
                  </FormGroup>
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
                  <FormGroup className="mt-4">
                    <div className="text-center">
                      <Link to="/forgot" style={{fontSize: 16}}>I forgot my password</Link>
                    </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
