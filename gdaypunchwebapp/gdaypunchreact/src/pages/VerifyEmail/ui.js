import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import FeaturedSection from "components/featuredSection";
import { SectionTitle } from "components/sectionTitle";
import LoadingSpinner from "components/loadingSpinner";

import { App, ResetForm, SuccessLabel } from "./styles";
import { ErrorField } from "src/components/errorField";

function Ui(props) {
  const {
    verifyEmail,
    userState: user,
    emailVerificationState: { verifying, verifyingFinished, error },
    history,
  } = props;
  const { token } = useParams();

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const finishedLoading = !verifying && verifyingFinished;
  return (
    <App id="top" className="App">
      <FeaturedSection top>
        <SectionTitle>Email Verification</SectionTitle>
        {verifying && <LoadingSpinner />}
        {finishedLoading && user.verified && !error && (
          <SuccessLabel>
            Successfully verified your email! You now have access to all the
            Australian made manga in the Gday Punch Web App
          </SuccessLabel>
        )}
        {finishedLoading && error && (
          <ErrorField className="error-field">
            <div>
              Email verification failed. Please try the link in your email again
              or request another verification email.
            </div>
          </ErrorField>
        )}
      </FeaturedSection>
    </App>
  );
}

export default Ui;
