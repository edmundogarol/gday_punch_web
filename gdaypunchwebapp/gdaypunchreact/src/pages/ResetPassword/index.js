import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, withRouter } from "react-router-dom";
import { Input, Button } from "antd";

import FeaturedSection from "components/featuredSection";
import { SectionTitle } from "components/sectionTitle";
import LoadingSpinner from "components/loadingSpinner";
import { ErrorField } from "components/errorField";
import { selectResetPasswordState } from "selectors/app";
import {
  resetPassword,
  resetPasswordSubmitted,
  resetPasswordVerify,
} from "actions/user";
import { useScrollTop } from "utils/hooks/useScrollTop";

import {
  App,
  ResetForm,
  RequiredField,
  EmailContainer,
  SuccessLabel,
} from "./styles";

function ResetPassword({ history }) {
  const {
    errors: resetErrors,
    submitted,
    submitting,
  } = useSelector(selectResetPasswordState);

  const dispatch = useDispatch();

  const [resetEmail, updateResetEmail] = useState(undefined);
  const { consumer } = useParams();

  useScrollTop();

  useEffect(() => {
    if (consumer) {
      dispatch(resetPasswordVerify(consumer, history));
    }
  }, [consumer]);

  useEffect(() => {
    if (submitted) {
      updateResetEmail(undefined);
    }
  }, [submitted]);

  useEffect(() => {
    return () => {
      if (submitted) {
        updateResetEmail(undefined);
      }
      dispatch(resetPasswordSubmitted(false));
    };
  }, []);

  const handleSubmitForm = () => {
    dispatch(resetPassword(resetEmail));
  };

  return (
    <App id="top" className="App">
      <FeaturedSection top>
        <SectionTitle>Reset Password</SectionTitle>
        {submitted && (
          <SuccessLabel>
            <p>
              We&apos;ve emailed you instructions for setting your password, if
              an account exists with the email you entered. You should receive
              them shortly.
            </p>
            <p>
              If you don&apos;t receive an email, please make sure you&apos;ve
              entered the address you registered with, and check your spam
              folder.
            </p>
          </SuccessLabel>
        )}
        {submitting && <LoadingSpinner />}
        {!submitted && !submitting && (
          <ResetForm>
            <h3>
              Forgotten your password? Enter your email address below, and
              we&apos;ll send instructions for setting a new one.
            </h3>
            <EmailContainer>
              <h4>
                Email<RequiredField>*</RequiredField>
              </h4>
              <Input
                name="email"
                placeholder={"Email"}
                value={resetEmail}
                onChange={(e) => updateResetEmail(e.target.value)}
              />
            </EmailContainer>
            {Object.values(resetErrors).map((error, idx) => (
              <ErrorField key={idx}>
                <div>
                  <label>{error}</label>
                </div>
              </ErrorField>
            ))}
            <Button onClick={() => handleSubmitForm()}>
              Reset Password Submit
            </Button>
          </ResetForm>
        )}
      </FeaturedSection>
    </App>
  );
}

export default withRouter(ResetPassword);
