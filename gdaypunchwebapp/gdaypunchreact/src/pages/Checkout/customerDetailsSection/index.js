import React from "react";

import { SubscribeCondition } from "../styles";
import GPAddressForm from "../addressForm";
import AddressSummary from "../addressSummary";

function Ui(props) {
  const {
    checkoutForm,
    updateCheckoutForm,
    subscribeAgreed,
    handleSubscribeCheck,
    handleOpenSection,
  } = props;

  if (checkoutForm.formOpen) {
    return (
      <>
        <GPAddressForm
          type="shipping"
          addressForm={checkoutForm}
          updateAddressForm={updateCheckoutForm}
        />
        <SubscribeCondition>
          <input
            checked={subscribeAgreed}
            type="checkbox"
            onChange={handleSubscribeCheck}
          />
          <p>{"Keep me up to date with news and offers"}</p>
        </SubscribeCondition>
        <button onClick={() => handleOpenSection("shipping")}>Next</button>
      </>
    );
  }
  return <AddressSummary form={checkoutForm} />;
}

export default Ui;
