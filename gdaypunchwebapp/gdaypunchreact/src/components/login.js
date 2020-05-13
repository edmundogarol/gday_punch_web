import React from "react";
import PropTypes from "prop-types";
import {
  doLogin,
  doLogout,
  doRegistration,
  openRegistration,
  closeRegistration
} from "actions/user";
import {
  selectLoginViewToggle,
  selectLoginError,
  selectRegistrationError,
  selectSuggestRegistration,
  selectLoggedIn
} from "selectors/app";
import { ErrorField } from "components/errorField";
import { InfoField } from "components/infoField";
import { ConditionsField } from "components/conditionsField";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { isEmpty } from "lodash";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      subscribeOpen: false,
      subscribeAgree: false
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loggedIn === false && this.props.loggedIn) {
      this.setState({ email: "", password: "" });
    }
  }

  handleLoginSubmit() {
    const { email, password } = this.state;
    this.props.login({
      email,
      password
    });
  }

  handleRegisterSubmit() {
    const { email, password } = this.state;
    if (this.state.subscribeAgree) {
      console.log("this.state.subscribeAgree", this.state.subscribeAgree);
      this.props.register({
        email,
        password
      });
      this.setState({ subscribeOpen: false });
      this.setState({ subscribeAgree: false });
    } else {
      this.setState({ subscribeOpen: true });
    }
  }

  handleKeyDown(e, type) {
    if (e.key === "Enter") {
      switch (type) {
        case "signup":
          this.handleRegisterSubmit();
          break;
        case "login":
          this.handleLoginSubmit();
          break;
        default:
          break;
      }
    }
  }

  render() {
    const {
      loginView,
      loginError,
      registrationError,
      suggestRegistration
    } = this.props;

    return (
      <div className={`registration ${loginView ? "show" : ""}`}>
        <div className="registration-inputs">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <div>
              <input
                type="text"
                name="email"
                onChange={(e) => this.setState({ email: e.target.value })}
                value={this.state.email}
                onKeyDown={(e) => this.handleKeyDown(e, "login")}
                placeholder="Enter Email"
              />
              {/* {registrationError && registrationError.email && (
                <ErrorField>
                  <div>{registrationError.email}</div>
                </ErrorField>
              )} */}
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="email">Password</label>
            <div>
              <input
                type="password"
                name="password"
                onChange={(e) => this.setState({ password: e.target.value })}
                onKeyDown={(e) => this.handleKeyDown(e, "login")}
                value={this.state.password}
                placeholder="Enter Password"
              />
              {/* {registrationError && registrationError.password && (
                <ErrorField>
                  <div>{registrationError.password}</div>
                </ErrorField>
              )} */}
            </div>
          </div>
        </div>
        {loginError && (
          <ErrorField>
            <div>
              <label>Error:</label>
              {loginError.detail}
            </div>
          </ErrorField>
        )}
        {this.state.subscribeOpen && (
          <ConditionsField>
            <div>
              <input
                type="checkbox"
                onChange={() => this.setState({ subscribeAgree: true })}
              />
              <p>{"I agree to sign up and subscribe to read and receive more, cool manga content!"}</p>
            </div>
          </ConditionsField>
        )}
        {registrationError && (
          <ErrorField>
            <div>
              {Object.keys(registrationError).map((field) => (
                <p key={field}>
                  <span>{field} - </span>
                  {registrationError[field]}
                  &nbsp;
                </p>
              ))}
            </div>
          </ErrorField>
        )}
        {!isEmpty(suggestRegistration) && (
          <InfoField>
            <div>{suggestRegistration}</div>
          </InfoField>
        )}
        <div className="account-buttons">
          <button
            onClick={() => this.handleRegisterSubmit()}
            className="sign-up-button"
            type="submit"
          >
            Sign Up
          </button>
          <span></span>
          <button
            onClick={() => this.handleLoginSubmit()}
            className="sign-up-button"
            type="submit"
          >
            Login
          </button>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  // Redux Properties
  loggedIn: PropTypes.bool.isRequired,
  loginView: PropTypes.bool.isRequired,
  loginError: PropTypes.object,
  registrationError: PropTypes.object,
  suggestRegistration: PropTypes.string.isRequired,

  // Redux Functions
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  openRegister: PropTypes.func.isRequired,
  closeRegister: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  loggedIn: selectLoggedIn,
  loginView: selectLoginViewToggle,
  loginError: selectLoginError,
  registrationError: selectRegistrationError,
  suggestRegistration: selectSuggestRegistration
});

const mapDispatchToProps = {
  login: doLogin,
  logout: doLogout,
  register: doRegistration,
  openRegister: openRegistration,
  closeRegister: closeRegistration
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
