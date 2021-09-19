import React from "react";
import { Radio, Space, Button } from "antd";

import { OrderSummaryLine } from "../styles";

function Ui(props) {
  const { shippingMethodOpen, freeShipping, handleOpenSection } = props;

  if (shippingMethodOpen) {
    return (
      <>
        <OrderSummaryLine singleLine>
          <Radio.Group value={freeShipping ? "free" : "international"}>
            <Space direction="vertical">
              <Radio value="free" disabled={!freeShipping}>
                Australia Free Standard Shipping
                <p>Free</p>
              </Radio>
              <Radio value="international" disabled={freeShipping}>
                International Standard Shipping
                <p>AUD$13.00</p>
              </Radio>
            </Space>
          </Radio.Group>
        </OrderSummaryLine>
        <Button
          className="next-button"
          onClick={() => handleOpenSection("billing")}
        >
          Next
        </Button>
      </>
    );
  }

  return (
    <OrderSummaryLine singleLine>
      <div>
        {freeShipping ? (
          <p>
            Australia Free Standard Shipping<span>(Free)</span>
          </p>
        ) : (
          <p>
            International Standard Shipping
            <span>(AUD$13.00)</span>
          </p>
        )}
      </div>
    </OrderSummaryLine>
  );
}

export default Ui;
