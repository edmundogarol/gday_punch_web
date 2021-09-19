import React from "react";
import { Radio, Space, Button } from "antd";

import { OrderSummaryLine } from "../styles";
import GPAddressForm from "../addressForm";
import AddressSummary from "../addressSummary";

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
        <Button
          className="next-button"
          onClick={() => handleOpenSection("payment")}
        >
          Next
        </Button>
      )}
    </>
  );

  if (billingForm.formOpen) {
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
        <Button
          className="next-button"
          onClick={() => handleOpenSection("payment")}
        >
          Next
        </Button>
      </>
    );
  } else {
    if (useShippingDetails) {
      return (
        <OrderSummaryLine singleLine>
          <div>
            <p>Same as shipping address</p>
          </div>
        </OrderSummaryLine>
      );
    } else {
      return <AddressSummary form={billingForm} />;
    }
  }
}

export default Ui;
