import React, { useState, useEffect } from "react";
import { Button, Tabs } from "antd";
const { TabPane } = Tabs;

import FeaturedSection from "components/featuredSection";
import { SectionTitle } from "components/sectionTitle";

import { App } from "./styles";
import { ErrorField } from "src/components/errorField";

function Ui(props) {
  const { user } = props;

  console.log({ user });
  return (
    <App id="top" className="App">
      <FeaturedSection top>
        <SectionTitle>Account</SectionTitle>
        {/* {submitted && (
          <SuccessLabel>
            Thank You! - we will get back to you as soon as possible.
          </SuccessLabel>
        )} */}
        <Tabs defaultActiveKey="1">
          <TabPane tab="Profile" key="1">
            Profile
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
