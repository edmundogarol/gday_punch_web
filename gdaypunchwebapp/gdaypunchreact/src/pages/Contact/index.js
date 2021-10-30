import React, { useState, useEffect } from "react";
import { Input, Button, Select, message } from "antd";
import { useDispatch, useSelector } from "react-redux";

import FeaturedSection from "components/featuredSection";
import { SectionTitle } from "components/sectionTitle";
import { ErrorField } from "components/errorField";
import { selectContactState } from "selectors/app";
import { getGdayPunchStaticUrl, emailValidator } from "utils/utils";
import { useScrollTop } from "utils/hooks/useScrollTop";

import {
  App,
  ContactForm,
  RequiredField,
  ContactImageContainer,
  SuccessLabel,
} from "./styles";
import { contactFormSubmitted, submitContactForm } from "actions/app";

const { TextArea } = Input;
const { Option } = Select;

function Ui() {
  const { errors: contactErrors, submitted } = useSelector(selectContactState);

  const dispatch = useDispatch();

  const [contactForm, updateContactForm] = useState({
    name: undefined,
    email: undefined,
    reason: "general",
    content: undefined,
  });

  useScrollTop();

  useEffect(() => {
    if (submitted) {
      updateContactForm({
        name: undefined,
        email: undefined,
        reason: "general",
        content: undefined,
      });
    }

    return () => {
      if (submitted) dispatch(contactFormSubmitted(false));
    };
  }, [submitted]);

  const handleSubmitForm = () => {
    if (!emailValidator(contactForm.email)) {
      message.error("Invalid email. Please check and try again.");
    } else {
      dispatch(submitContactForm(contactForm));
    }
  };

  const contactReasons = {
    general: "General Enquiry",
    order: "Order Enquiry",
    advertising: "Advertising Enquiry",
    subscription: "Subscription Enquiry",
    subscription_cancellation: "Cancel Subscription",
    unsubscribe: "Email Unsubscribe",
    bug_report: "Bug Report",
    report: "Report",
  };

  return (
    <App id="top" className="App">
      <FeaturedSection top>
        <SectionTitle>Contact Us</SectionTitle>
        {submitted && (
          <SuccessLabel>
            Thank You! - we will get back to you as soon as possible.
          </SuccessLabel>
        )}
        <ContactImageContainer>
          {!submitted && (
            <ContactForm>
              <h3>Have any questions?</h3>
              <h1>Drop us a line!</h1>
              <div>
                <h4>
                  Name<RequiredField>*</RequiredField>
                </h4>
                <Input
                  placeholder={"Name"}
                  value={contactForm.name}
                  onChange={(e) =>
                    updateContactForm({ ...contactForm, name: e.target.value })
                  }
                />
                {contactErrors.name && (
                  <ErrorField className="success-label">
                    <div>
                      <label>Missing Name field</label>
                    </div>
                  </ErrorField>
                )}
              </div>
              <div>
                <h4>
                  Email<RequiredField>*</RequiredField>
                </h4>
                <Input
                  placeholder={"Email"}
                  value={contactForm.email}
                  onChange={(e) =>
                    updateContactForm({ ...contactForm, email: e.target.value })
                  }
                />
                {contactErrors.email && (
                  <ErrorField>
                    <div>
                      <label>Missing Email field</label>
                    </div>
                  </ErrorField>
                )}
              </div>
              <div>
                <h4>
                  Reason<RequiredField>*</RequiredField>
                </h4>
                <Select
                  value={contactForm.reason}
                  onChange={(val) => {
                    updateContactForm({ ...contactForm, reason: val });
                  }}
                >
                  {Object.entries(contactReasons).map(([key, value]) => (
                    <Option key={key} value={key}>
                      {value}
                    </Option>
                  ))}
                </Select>
              </div>
              <div>
                <h4>
                  Message<RequiredField>*</RequiredField>
                </h4>
                <TextArea
                  rows={7}
                  showCount={
                    contactForm.content && contactForm.content.length > 400
                  }
                  maxLength={500}
                  value={contactForm.content}
                  onChange={(e) =>
                    updateContactForm({
                      ...contactForm,
                      content: e.target.value,
                    })
                  }
                  placeholder="Enter Message"
                />
              </div>
              <Button onClick={() => handleSubmitForm()}>Submit</Button>
            </ContactForm>
          )}
          <img src={getGdayPunchStaticUrl("dearyou-small.png")} />
        </ContactImageContainer>
      </FeaturedSection>
    </App>
  );
}

export default Ui;
