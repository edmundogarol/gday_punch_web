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
    conditionalValidationFields,
    handleOpenSection,
    allDigitalCart,
  } = props;

  if (checkoutForm.formOpen) {
    return (
      <>
        <GPAddressForm
          type="shipping"
          addressForm={checkoutForm}
          allDigitalCart={allDigitalCart}
          updateAddressForm={updateCheckoutForm}
          conditionalValidationFields={conditionalValidationFields}
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
          onClick={() =>
            handleOpenSection(allDigitalCart ? "billing" : "shipping")
          }
        >
          Next
        </Button>
      </>
    );
  }
  return <AddressSummary form={checkoutForm} allDigitalCart={allDigitalCart} />;
}

export default Ui;
