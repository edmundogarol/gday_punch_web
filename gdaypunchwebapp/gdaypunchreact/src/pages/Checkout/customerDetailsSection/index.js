import React from "react";
import { Button } from "antd";
import { SubscribeCondition } from "../styles";
import GPAddressForm from "../addressForm";
import AddressSummary from "../addressSummary";

function Ui(props) {
  const {
    loggedIn,
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
          loggedIn={loggedIn}
        />
        <SubscribeCondition>
          <input
            checked={subscribeAgreed}
            type="checkbox"
            onChange={handleSubscribeCheck}
          />
          <p>{"Keep me up to date with news and offers"}</p>
        </SubscribeCondition>
        <Button
          className="next-button"
          onClick={() => handleOpenSection("shipping")}
        >
          Next
        </Button>
      </>
    );
  }
  return <AddressSummary form={checkoutForm} />;
}

export default Ui;
