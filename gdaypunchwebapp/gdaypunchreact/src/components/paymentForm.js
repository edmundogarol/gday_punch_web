import React from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";

import { gdayfetch } from "utils/gdayfetch";

export default function CheckoutForm() {
  const stripe = useStripe();

  const handleClick = async (event) => {
    const response = await gdayfetch("payments/create-checkout-session/", {
      method: "POST",
    });

    const result = await stripe.redirectToCheckout({
      sessionId: response.data.id,
    });

    if (result.error) {
      alert(result.error.message);
    }
  };

  return (
    <button role="link" onClick={handleClick}>
      Checkout
    </button>
  );
}
