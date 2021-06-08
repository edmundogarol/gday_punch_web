import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import { gdayfetch } from "utils/gdayfetch";

// const stripePromise = loadStripe("pk_live_mTfZz6d7N3Lm44Wgqbzn24Tf");
const stripePromise = loadStripe("pk_test_QgTiwo4w3EXdQS9hOywypRAF");

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleClick = async (event) => {
    // Get Stripe.js instance
    const stripe = await stripePromise;

    // Call your backend to create the Checkout Session
    const response = await gdayfetch("payments/create-checkout-session/", {
      method: "POST",
    });

    // When the customer clicks on the button, redirect them to Checkout.
    const result = await stripe.redirectToCheckout({
      sessionId: response.data.id,
    });

    if (result.error) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `result.error.message`.
    }
  };

  return (
    <button role="link" onClick={handleClick}>
      Checkout
    </button>
  );
}
