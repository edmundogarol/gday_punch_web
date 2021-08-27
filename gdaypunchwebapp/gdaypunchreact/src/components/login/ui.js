import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
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
  ForgotPassword,
} from "./styles";
import { NavLink } from "react-router-dom";

function Ui(props) {
  const {
    loggedIn,
    loginView,
    loginError,
    clearLoginError,
    registrationError,
    suggestRegistration,
    login,
    register,
  } = props;
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [subscribeAgree, setSubscribeAgree] = useState(false);
  const [registerSubscribeError, setRegisterSubscribeError] = useState(false);
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (loggedIn) {
      setLoginDetails({ email: "", password: "" });
    }
  }, [loggedIn]);

  const handleLoginSubmit = () => {
    login(loginDetails);
  };

  const handleRegisterSubmit = () => {
    const { email, password } = loginDetails;

    if (loginError) clearLoginError();

    // Remove space from end of email
    const emailSanitised =
      email.charAt(email.length - 1) === " " ? email.slice(0, -1) : email;

    if (subscribeOpen) {
      if (subscribeAgree) {
        register({
          email: emailSanitised,
          password,
        });

        setSubscribeOpen(false);
        setSubscribeAgree(false);
        setRegisterSubscribeError(false);
      } else {
        setRegisterSubscribeError(true);
      }
    } else {
      setSubscribeOpen(true);
    }
  };

  const handleKeyDown = (e, type) => {
    if (e.key === "Enter") {
      switch (type) {
        case "signup":
          handleRegisterSubmit();
          break;
        case "login":
          handleLoginSubmit();
          break;
        default:
          break;
      }
    }
  };

  const handleSubscribeCheck = (e) => {
    setSubscribeAgree(e.target.checked);
  };

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
              onChange={(e) =>
                setLoginDetails({ ...loginDetails, email: e.target.value })
              }
              value={loginDetails.email}
              onKeyDown={(e) => handleKeyDown(e, "login")}
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
              onChange={(e) =>
                setLoginDetails({ ...loginDetails, password: e.target.value })
              }
              onKeyDown={(e) => handleKeyDown(e, "login")}
              value={loginDetails.password}
              placeholder="Enter Password"
            />
          </div>
        </InputGroupContainer>
      </RegistrationInputsContainer>
      {loginError && (
        <ErrorField>
          <div>
            <label>Error:</label>
            <span>{loginError.detail}</span>
          </div>
        </ErrorField>
      )}
      {registerSubscribeError && (
        <ErrorField>
          <div>
            <label>Error:</label>
            <span>
              Please agree to sign up and subscribe to cool manga content
            </span>
          </div>
        </ErrorField>
      )}
      {subscribeOpen && (
        <ConditionsField>
          <div>
            <input type="checkbox" onClick={handleSubscribeCheck} />
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
        <SignUpButton onClick={() => handleRegisterSubmit()} type="submit">
          Sign Up
        </SignUpButton>
        <span></span>
        <SignUpButton onClick={() => handleLoginSubmit()} type="submit">
          Login
        </SignUpButton>
      </AccountActionButtons>
      <ForgotPassword to="/forgot-password">
        Forgot Your Password?
      </ForgotPassword>
    </RegistrationContainer>
  );
}

export default Ui;
