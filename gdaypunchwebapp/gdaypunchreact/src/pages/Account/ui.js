import React, { useState, useEffect } from "react";
import { Button, Card, Badge, Tabs, Tooltip, Result } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import classNames from "classnames";
const { TabPane } = Tabs;

import FeaturedSection from "components/featuredSection";
import { SectionTitle } from "components/sectionTitle";
import LoadingSpinner from "components/loadingSpinner";

import { App, DetailField } from "./styles";

function Ui(props) {
  const { user, emailVerificationState, requestEmailVerification } = props;
  const {
    requesting,
    requestingFinished,
    requestingErrors: errors,
  } = emailVerificationState;

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

  return (
    <App id="top" className="App">
      <FeaturedSection top>
        <SectionTitle>Account</SectionTitle>
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={<Badge dot={attentionNeeded("profile")}>Profile</Badge>}
            key="1"
          >
            <Card title="Account Details" loading={!user.email}>
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
                    <Tooltip
                      placement="top"
                      title={"Request a verification email"}
                    >
                      <a href="#" onClick={() => requestEmailVerification()}>
                        Verify
                      </a>
                    </Tooltip>
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
                <DetailField>
                  <p>{user.email}</p>
                  <span />
                  <span />
                  {user.verified !== "verified" ? (
                    <p className="error">Email Verification Needed</p>
                  ) : null}
                </DetailField>
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
