import React, { useState, useEffect } from "react";
import { Input, Button, Card, Badge, Tabs, Tooltip, Result } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import classNames from "classnames";
const { TabPane } = Tabs;

import FeaturedSection from "components/featuredSection";
import { SectionTitle } from "components/sectionTitle";
import LoadingSpinner from "components/loadingSpinner";
import { ErrorField } from "components/errorField";

import { App, DetailField, EditButton } from "./styles";

function Ui(props) {
  const {
    user,
    emailVerificationState,
    requestEmailVerification,
    updateUserDetails,
    userUpdateError,
    updateUserDetailsError,
  } = props;
  const {
    requesting,
    requestingFinished,
    requestingErrors: errors,
  } = emailVerificationState;
  const [editingEmail, toggleEditingEmail] = useState(false);
  const [email, updateEmail] = useState(user.email);

  const attentionNeeded = (section) => {
    if (!user.email) return false;

    switch (section) {
      case "profile":
        if (user.verified !== "verified") {
          return true;
        }
      default:
        return false;
    }
  };

  const handleUpdateEmail = () => {
    if (email === user.email) {
      toggleEditingEmail(false);
    } else {
      updateUserDetails({ email });
    }
  };

  const editSaveCancelRender = (header) => {
    if (!editingEmail) {
      return (
        <EditButton separator={header} onClick={() => toggleEditingEmail(true)}>
          Edit
        </EditButton>
      );
    }
    return (
      <div>
        <EditButton separator="true" onClick={() => handleUpdateEmail()}>
          Save
        </EditButton>
        <EditButton
          separator={header}
          onClick={() => {
            toggleEditingEmail(false);
            updateUserDetailsError(undefined);
          }}
        >
          Cancel
        </EditButton>
      </div>
    );
  };

  return (
    <App id="top" className="App">
      <FeaturedSection top>
        <SectionTitle>Account</SectionTitle>
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={<Badge dot={attentionNeeded("profile")}>Details</Badge>}
            key="1"
          >
            <Card title="Profile" loading={!user.email}>
              <Card
                type="inner"
                title="User"
                extra={
                  <Tooltip placement="top" title={"Edit not available yet"}>
                    <a href="#" className="disabled">
                      Edit
                    </a>
                  </Tooltip>
                }
              >
                <DetailField>
                  <label>Username</label>
                  <p
                    className={classNames({
                      unset: !user.username || !user.username.length,
                    })}
                  >
                    {!user.username || !user.username.length ? (
                      <Tooltip
                        placement="top"
                        title={"Set username by commenting on a manga :)"}
                      >
                        Unset
                      </Tooltip>
                    ) : (
                      user.username
                    )}
                  </p>
                </DetailField>
              </Card>
              <Card
                className="non-first-tab"
                type="inner"
                title={
                  <Badge dot={user.verified !== "verified"} offset={[5]}>
                    Email
                  </Badge>
                }
                loading={!user.email}
                extra={
                  user.verified !== "verified" ? (
                    <>
                      {editSaveCancelRender(true)}
                      <Tooltip
                        placement="top"
                        title={"Request a verification email"}
                      >
                        <a href="#" onClick={() => requestEmailVerification()}>
                          Verify
                        </a>
                      </Tooltip>
                    </>
                  ) : (
                    <Tooltip placement="top" title={"Email verified"}>
                      <CheckCircleOutlined />
                    </Tooltip>
                  )
                }
              >
                {requesting ? <LoadingSpinner /> : null}
                {requestingFinished && !errors && (
                  <Result
                    status="success"
                    title="Verification email has been sent!"
                    subTitle="Please check your inbox or junk folder."
                    extra={<Button>Request Another</Button>}
                  />
                )}
                <DetailField noLabel="true">
                  {editingEmail ? (
                    <Input
                      name="email"
                      value={email}
                      onChange={(e) => updateEmail(e.target.value)}
                    />
                  ) : (
                    <p>{user.email}</p>
                  )}
                  <span />
                  {user.verified !== "verified" ? (
                    <p className="error">Email Verification Needed</p>
                  ) : (
                    editSaveCancelRender()
                  )}
                </DetailField>
                {userUpdateError && (
                  <ErrorField>
                    <div>
                      {Object.keys(userUpdateError).map((field) => (
                        <p key={field}>
                          <span>{field} - </span>
                          {userUpdateError[field]}
                          &nbsp;
                        </p>
                      ))}
                    </div>
                  </ErrorField>
                )}
              </Card>
            </Card>
          </TabPane>
          <TabPane tab="Orders" key="2">
            Orders
          </TabPane>
          <TabPane tab="Subscriptions" key="3">
            Subscriptions
          </TabPane>
          <TabPane tab="Payment" disabled key="4">
            Payment
          </TabPane>
        </Tabs>
      </FeaturedSection>
    </App>
  );
}

export default Ui;
