import React from "react";
import { Radio, Space } from "antd";

import { OrderSummaryLine } from "../styles";
import GPAddressForm from "../addressForm";

function Ui(props) {
  const {
    billingForm,
    useShippingDetails,
    toggleUseShippingDetails,
    updateCountriesDownloaded,
    updateBillingForm,
    handleOpenSection,
  } = props;

  const useShippingDetailsSelector = () => (
    <>
      <OrderSummaryLine singleLine>
        <Radio.Group
          onChange={(e) => {
            const useShipping = e.target.value === "shipping";
            toggleUseShippingDetails(useShipping);
            if (useShipping) {
              updateCountriesDownloaded(false);
            }
          }}
          value={useShippingDetails ? "shipping" : "billing"}
        >
          <Space direction="vertical">
            <Radio value="shipping">Same as shipping address</Radio>
            <Radio value="billing">Use different billing address</Radio>
          </Space>
        </Radio.Group>
      </OrderSummaryLine>
      {useShippingDetails && (
        <button onClick={() => handleOpenSection("payment")}>Next</button>
      )}
    </>
  );

  if (useShippingDetails) {
    return useShippingDetailsSelector();
  }

  return (
    <>
      {useShippingDetailsSelector()}
      <GPAddressForm
        type="billing"
        addressForm={billingForm}
        updateAddressForm={updateBillingForm}
      />
      <button onClick={() => handleOpenSection("payment")}>Next</button>
    </>
  );
}

export default Ui;
