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
import { useScrollTop } from "utils/hooks/useScrollTop";

function Ui(props) {
  const {
    user,
    downloadManuscriptRequest,
    resetDownloadManuscriptRequest,
    downloadManuscriptState,
  } = props;
  const { errors, requesting, finished } = downloadManuscriptState;
  const [manuscriptEmail, updateManuscriptEmail] = useState(undefined);

  useScrollTop();

  useEffect(() => {
    return () => {
      resetDownloadManuscriptRequest();
    };
  }, []);

  useEffect(() => {
    if (finished && !errors) {
      updateManuscriptEmail(undefined);
    }
  }, [finished, errors]);

  const handleSubmitForm = () => {
    downloadManuscriptRequest(user.logged_in ? user.email : manuscriptEmail);
  };

  return (
    <App id="top" className="App">
      <FeaturedSection top>
        <SectionTitle>Downloads</SectionTitle>
        {finished && !errors && (
          <SuccessLabel>
            {user.subscribed
              ? "Download link has been sent to your email."
              : "Thank you for subscribing! Enjoy our free resources."}
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

            {user.subscribed ? null : (
              <>
                <div>
                  <div>
                    <h2>
                      <span style={{ fontSize: "small" }}>
                        [We will not send you spam! Only specials and manga
                        related awesomeness]
                      </span>
                    </h2>
                  </div>
                </div>
                {user.logged_in ? null : (
                  <>
                    <h4>
                      Email<RequiredField>*</RequiredField>
                    </h4>
                    <Input
                      name="email"
                      placeholder={"Email"}
                      value={manuscriptEmail}
                      onChange={(e) => updateManuscriptEmail(e.target.value)}
                    />
                  </>
                )}
              </>
            )}
            {errors && (
              <ErrorField>
                <div>
                  <label>{errors}</label>
                </div>
              </ErrorField>
            )}
            <SubscribeButton onClick={() => handleSubmitForm()}>
              <SubscribeText>
                {user.subscribed ? "Download" : "Subscribe and Download"}
              </SubscribeText>
            </SubscribeButton>
          </SubscribeContainer>
          <Image src={getGdayPunchStaticUrl("a4-manuscript-preview.jpg")} />
        </DownloadItemContainer>
      </FeaturedSection>
    </App>
  );
}

export default Ui;
