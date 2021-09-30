import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Input, Button } from "antd";

import FeaturedSection from "components/featuredSection";
import { SectionTitle } from "components/sectionTitle";
import LoadingSpinner from "components/loadingSpinner";

import {
  App,
  ResetForm,
  RequiredField,
  EmailContainer,
  SuccessLabel,
} from "./styles";
import { ErrorField } from "src/components/errorField";
import { useScrollTop } from "utils/hooks/useScrollTop";

function Ui(props) {
  const {
    resetPassword,
    resetPasswordState,
    resetPasswordSubmitted,
    resetPasswordVerify,
    history,
  } = props;
  const { errors: resetErrors, submitted, submitting } = resetPasswordState;
  const [resetEmail, updateResetEmail] = useState(undefined);
  const { consumer } = useParams();

  useScrollTop();

  useEffect(() => {
    if (consumer) {
      resetPasswordVerify(consumer, history);
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
      resetPasswordSubmitted(false);
    };
  }, []);

  const handleSubmitForm = () => {
    resetPassword(resetEmail);
  };

  return (
    <App id="top" className="App">
      <FeaturedSection top>
        <SectionTitle>Reset Password</SectionTitle>
        {submitted && (
          <SuccessLabel>
            <p>
              We've emailed you instructions for setting your password, if an
              account exists with the email you entered. You should receive them
              shortly.
            </p>
            <p>
              If you don't receive an email, please make sure you've entered the
              address you registered with, and check your spam folder.
            </p>
          </SuccessLabel>
        )}
        {submitting && <LoadingSpinner />}
        {!submitted && !submitting && (
          <ResetForm>
            <h3>
              Forgotten your password? Enter your email address below, and we'll
              send instructions for setting a new one.
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

export default Ui;
