import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Input, Button } from "antd";

import FeaturedSection from "components/featuredSection";
import { SectionTitle } from "components/sectionTitle";
import LoadingSpinner from "components/loadingSpinner";

import {
  App,
  ResetForm,
  EmailContainer,
  SuccessLabel,
  ErrorLabel,
} from "./styles";
import { ErrorField } from "src/components/errorField";

function Ui(props) {
  const {
    resetPasswordState,
    resetPasswordSubmitNew,
    resetPasswordSubmitted,
    updateResetPasswordErrors,
    history,
  } = props;
  const {
    submitted,
    submitting,
    verifiedToken,
    errors: resetErrors,
  } = resetPasswordState;
  const [newPassword, updateNewPassword] = useState(undefined);
  const [confirmPassword, updateConfirmPassword] = useState(undefined);

  useEffect(() => {
    if (!verifiedToken) {
      history.push("/");
    }
  }, [verifiedToken]);

  useEffect(() => {
    return () => {
      if (submitted) {
        resetPasswordSubmitted(false);
      }
    };
  }, [submitted]);

  const handleSubmitForm = () => {
    resetPasswordSubmitNew(newPassword, verifiedToken);
  };

  const submissionSuccess = submitted && !resetErrors.error;
  const showForm = !submitted && !resetErrors.error;
  const submittedErrors = submitted && resetErrors.error;

  return (
    <App id="top" className="App">
      <FeaturedSection top>
        <SectionTitle>Reset Password</SectionTitle>
        {submissionSuccess && (
          <SuccessLabel>
            <p>Your password has successfully been reset!</p>
            <p>You will now be able to log in with your new password.</p>
          </SuccessLabel>
        )}
        {submittedErrors &&
          (resetErrors.error["expired"] || resetErrors.error["not_found"]) && (
            <ErrorLabel>
              {resetErrors.error["expired"] && (
                <p>{resetErrors.error["expired"]}</p>
              )}
              {resetErrors.error["not_found"] && (
                <p>{resetErrors.error["not_found"]}</p>
              )}
            </ErrorLabel>
          )}
        {submitting && <LoadingSpinner />}
        {(showForm || submittedErrors) && (
          <ResetForm>
            <h3>New Password</h3>
            <EmailContainer>
              <Input
                name="password"
                type="password"
                placeholder={"New Password"}
                value={newPassword}
                onChange={(e) => updateNewPassword(e.target.value)}
              />
            </EmailContainer>
            <h3>Confirm Password</h3>
            <EmailContainer>
              <Input
                name="password2"
                type="password"
                placeholder={"Confirm Password"}
                value={confirmPassword}
                onChange={(e) => updateConfirmPassword(e.target.value)}
              />
            </EmailContainer>
            {resetErrors.error && resetErrors.error["invalid"] && (
              <ErrorField>
                <div>
                  <label>{resetErrors.error["invalid"]}</label>
                </div>
              </ErrorField>
            )}
            {resetErrors.error &&
            (resetErrors.error["expired"] || resetErrors.error["not_found"]) ? (
              <Button
                onClick={() => {
                  updateResetPasswordErrors(undefined);
                  resetPasswordSubmitted(false);
                  history.push("/forgot-password");
                }}
              >
                Reset Password Request
              </Button>
            ) : (
              <Button onClick={() => handleSubmitForm()}>
                Create New Password
              </Button>
            )}
          </ResetForm>
        )}
      </FeaturedSection>
    </App>
  );
}

export default Ui;
