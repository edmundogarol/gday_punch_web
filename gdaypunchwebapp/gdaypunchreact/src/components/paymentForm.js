import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useStripe, useElements } from "@stripe/react-stripe-js";

import { gdayfetch } from "utils/gdayfetch";

const stripePromise = loadStripe(
  process.env.NODE_ENV === "development"
    ? "pk_test_QgTiwo4w3EXdQS9hOywypRAF"
    : "pk_live_mTfZz6d7N3Lm44Wgqbzn24Tf"
);

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleClick = async (event) => {
    const stripe = await stripePromise;
    const response = await gdayfetch("payments/create-checkout-session/", {
      method: "POST",
    });

    // const response = await gdayfetch("stripe-products", {
    //   method: "GET",
    // });

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
