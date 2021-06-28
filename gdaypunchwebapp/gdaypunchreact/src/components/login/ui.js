import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { isEmpty } from "lodash";

import { ErrorField } from "components/errorField";
import { InfoField } from "components/infoField";
import { ConditionsField } from "components/conditionsField";

import {
  RegistrationContainerHidden,
  RegistrationContainerVisible,
  RegistrationInputsContainer,
  InputGroupContainer,
  AccountActionButtons,
  SignUpButton,
} from "./styles";

class Ui extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      subscribeOpen: false,
      subscribeAgree: false,
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
      password,
    });
  }

  handleRegisterSubmit() {
    const { email, password } = this.state;

    // Remove space from end of email
    const emailSanitised =
      email.charAt(email.length - 1) === " " ? email.slice(0, -1) : email;

    if (this.state.subscribeAgree) {
      this.props.register({
        email: emailSanitised,
        password,
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
    const { loginView, loginError, registrationError, suggestRegistration } =
      this.props;

    const RegistrationContainer = loginView
      ? RegistrationContainerVisible
      : RegistrationContainerHidden;
    return (
      <RegistrationContainer>
        <RegistrationInputsContainer>
          <InputGroupContainer>
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
            </div>
          </InputGroupContainer>
          <InputGroupContainer>
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
            </div>
          </InputGroupContainer>
        </RegistrationInputsContainer>
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
              <p>
                {
                  "I agree to sign up and subscribe to read and receive more, cool manga content!"
                }
              </p>
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
        <AccountActionButtons>
          <SignUpButton
            onClick={() => this.handleRegisterSubmit()}
            type="submit"
          >
            Sign Up
          </SignUpButton>
          <span></span>
          <SignUpButton onClick={() => this.handleLoginSubmit()} type="submit">
            Login
          </SignUpButton>
        </AccountActionButtons>
      </RegistrationContainer>
    );
  }
}

export default Ui;
