import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import FeaturedSection from "components/featuredSection";
import { SectionTitle } from "components/sectionTitle";
import LoadingSpinner from "components/loadingSpinner";
import { ErrorField } from "components/errorField";
import { selectEmailVerificationState, selectUser } from "selectors/app";
import { useScrollTop } from "utils/hooks/useScrollTop";
import { verifyEmail } from "actions/user";

import { App, SuccessLabel } from "./styles";

function VerifyEmail() {
  const user = useSelector(selectUser);
  const { verifying, verifyingFinished, error } = useSelector(
    selectEmailVerificationState
  );
  const { token } = useParams();

  const dispatch = useDispatch();

  useScrollTop();

  useEffect(() => {
    if (token) {
      dispatch(verifyEmail(token));
    }
  }, [token]);

  const finishedLoading = !verifying && verifyingFinished;
  return (
    <App id="top" className="App">
      <FeaturedSection top>
        <SectionTitle>Email Verification</SectionTitle>
        {verifying && <LoadingSpinner />}
        {finishedLoading && user.verified === "verified" && !error && (
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

export default VerifyEmail;
