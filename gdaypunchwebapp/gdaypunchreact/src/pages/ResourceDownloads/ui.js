import React, { useState, useEffect } from "react";
import { Input } from "antd";

import FeaturedSection from "components/featuredSection";
import { SectionTitle } from "components/sectionTitle";
import Image from "components/image";

import {
  App,
  RequiredField,
  DownloadItemContainer,
  SuccessLabel,
  SubscribeContainer,
  SubscribeButton,
  SubscribeText,
} from "./styles";
import { getGdayPunchStaticUrl } from "utils/utils";
import { ErrorField } from "src/components/errorField";

function Ui(props) {
  const { submitContactForm, contactFormSubmitted, contactState } = props;
  const { errors: contactErrors, submitted } = contactState;
  const [manuscriptEmail, updateManuscriptEmail] = useState(undefined);

  useEffect(() => {
    if (submitted) {
      updateManuscriptEmail(undefined);
    }

    return () => {
      if (submitted) contactFormSubmitted(false);
    };
  }, [submitted]);

  const handleSubmitForm = () => {
    submitContactForm(manuscriptEmail);
  };

  return (
    <App id="top" className="App">
      <FeaturedSection top>
        <SectionTitle>Downloads</SectionTitle>
        {submitted && (
          <SuccessLabel>
            Thank you for subscribing! Enjoy our free resources.
          </SuccessLabel>
        )}
        <DownloadItemContainer>
          <SubscribeContainer>
            <h2>
              <span style={{ fontSize: "x-large" }}>
                FREE A4 Manga Manuscript Template
              </span>
              <br />
              <span style={{ fontSize: "medium" }}>
                Used for one-shot submissions
              </span>
            </h2>

            <div>
              <div>
                <h2>
                  <span style={{ fontSize: "small" }}>
                    [We will not send you spam! Only specials and manga related
                    awesomeness]
                  </span>
                </h2>
              </div>
            </div>
            <h4>
              Email<RequiredField>*</RequiredField>
            </h4>
            <Input
              placeholder={"Email"}
              value={manuscriptEmail}
              onChange={(e) => updateManuscriptEmail(e.target.value)}
            />
            {contactErrors.email && (
              <ErrorField>
                <div>
                  <label>Missing Email field</label>
                </div>
              </ErrorField>
            )}
            <SubscribeButton onClick={() => handleSubmitForm()}>
              <SubscribeText>Subscribe and Download</SubscribeText>
            </SubscribeButton>
          </SubscribeContainer>
          <Image src={getGdayPunchStaticUrl("a4-manuscript-preview.jpg")} />
        </DownloadItemContainer>
      </FeaturedSection>
    </App>
  );
}

export default Ui;
