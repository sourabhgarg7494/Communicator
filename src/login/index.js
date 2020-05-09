import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";

import { startLogin, sigininUserAuthProvider } from "../firebase/auth";
import LoginButtonPng from "../btn_google_signin_light_normal_web.png";

import "./index.scss";
class Login extends Component {
  state = {
    username: "",
    password: "",
    usernameValidation: "",
    passwordValidation: "",
    redirectToReferrer: false,
  };
  GoogleLogin = () => {
    this.props.startLogin();
  };
  componentDidMount() {
    if (this.props.auth && this.props.auth.uid) {
      this.setState({ redirectToReferrer: true });
    }
  }
  validateForm = () => {
    let isFormValid = true;

    if (!this.state.username) {
      isFormValid = false;
      this.setState({ usernameValidation: "Please Enter Email ID" });
    }

    if (!this.state.password) {
      isFormValid = false;
      this.setState({ passwordValidation: "Please Enter Password" });
    }
    return isFormValid;
  };
  onEmailIdPasswordLogin = (e) => {
    e.preventDefault();
    const isFormValid = this.validateForm();
    if (isFormValid) {
      this.props.sigininUserAuthProvider(
        this.state.username,
        this.state.password
      );
    }
  };
  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };

    const { redirectToReferrer } = this.state;

    if (redirectToReferrer === true) {
      return <Redirect to={from} />;
    }

    return (
      <div id="LoginForm">
        <div className="container">
          <div className="login-form">
            <div className="main-div">
              <div className="panel">
                <h2>Login</h2>
              </div>
              <form id="Login" onSubmit={this.onEmailIdPasswordLogin}>
                <div className="form-group">
                  <input
                    type="text"
                    className={
                      this.state.usernameValidation
                        ? "validation-error form-control"
                        : " form-control"
                    }
                    id="inputEmail"
                    placeholder="User Name"
                    name="username"
                    onChange={(e) => {
                      this.setState({
                        username: e.target.value,
                        usernameValidation: false,
                      });
                    }}
                  />
                  {this.state && this.state.usernameValidation && (
                    <div className="error-lable">
                      {this.state.usernameValidation}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <input
                    type="password"
                    className={
                      this.state.passwordValidation
                        ? "validation-error form-control"
                        : " form-control"
                    }
                    id="inputPassword"
                    placeholder="Password"
                    name="password"
                    onChange={(e) => {
                      this.setState({
                        password: e.target.value,
                        passwordValidation: false,
                      });
                    }}
                  />
                  {this.state && this.state.passwordValidation && (
                    <div className="error-lable">
                      {this.state.passwordValidation}
                    </div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </form>

              <button
                onClick={this.GoogleLogin}
                autoFocus
                className="google-login-btn"
              >
                <img
                  src={LoginButtonPng}
                  alt="google login button"
                  className="cursor"
                  title="Sign in with Google Account"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      // <div>
      //     <form onSubmit={this.onEmailIdPasswordLogin}>
      //         <input type="text" name="username" onChange={(e) => { this.setState({ username: e.target.value }) }} />
      //         {this.state && this.state.usernameValidation && <div className="error-lable">{this.state.usernameValidation}</div>}
      //         <input type="password" name="password" onChange={(e) => { this.setState({ password: e.target.value }) }} />
      //         {this.state && this.state.passwordValidation && <div className="error-lable">{this.state.passwordValidation}</div>}
      //         <button type="submit">Login</button>
      //     </form>
      // </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};
const mapDispatchToPops = (dispatch) => ({
  startLogin: () => {
    dispatch(startLogin());
  },
  sigininUserAuthProvider: (email, password) => {
    dispatch(sigininUserAuthProvider(email, password));
  },
});
export default connect(mapStateToProps, mapDispatchToPops)(Login);
