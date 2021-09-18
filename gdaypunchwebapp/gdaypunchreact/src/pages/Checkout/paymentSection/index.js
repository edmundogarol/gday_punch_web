import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { useElements } from "@stripe/react-stripe-js";
import { Alert } from "antd";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#797979",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

function Ui(props) {
  const { paymentOpen, billingForm, updateBillingForm } = props;

  if (!paymentOpen) return null;

  const [cardErrors, updateCardErrors] = useState({
    cardNumber: undefined,
    cardExpiry: undefined,
    cardCvc: undefined,
  });

  const elements = useElements();

  const createCardElement = (type, placeholder) => {
    const newCardElement = elements?.create(type, {
      placeholder,
      ...CARD_ELEMENT_OPTIONS,
    });

    newCardElement.on("change", function (event) {
      if (event.complete) {
        updateCardErrors({
          ...cardErrors,
          [type]: undefined,
        });
      } else if (event.error) {
        updateCardErrors({
          ...cardErrors,
          [type]: event.error.message,
        });
      }
    });

    return newCardElement;
  };

  useEffect(() => {
    if (!paymentOpen) return;
    const cardNumberRef = elements.getElement("cardNumber");
    const cardExpiryRef = elements.getElement("cardExpiry");
    const cardCvvRef = elements.getElement("cardCvc");

    if (cardNumberRef) {
      cardNumberRef.mount("#card-number-element");
      cardExpiryRef.mount("#card-expiry-element");
      cardCvvRef.mount("#card-cvv-element");
    } else {
      const cardNumberElement = createCardElement("cardNumber", "Card number");
      const cardExpiryElement = createCardElement(
        "cardExpiry",
        "Expiration date (MM / YY)"
      );
      const cardCvvElement = createCardElement("cardCvc", "Security code");

      cardNumberElement?.mount("#card-number-element");
      cardExpiryElement?.mount("#card-expiry-element");
      cardCvvElement?.mount("#card-cvv-element");
    }

    return () => {
      if (cardNumberRef) {
        cardNumberRef.destroy();
        cardExpiryRef.destroy();
        cardCvvRef.destroy();
      }
    };
  }, [paymentOpen]);

  return (
    <form id="card-form" data-address={`card-form-root`}>
      <div
        className={classNames("form-field", {
          "card-error": !!cardErrors.cardNumber,
        })}
        data-line-count="1"
      >
        <div id="card-number-element" data-line-count="1"></div>
        <Alert
          className="invalid-message"
          message={cardErrors.cardNumber}
          type="error"
        />
      </div>
      <div className={"form-field"} data-line-count="1">
        <input
          id="card-name"
          name="name"
          placeholder="Name on card"
          type="text"
          value={billingForm.cardName.value}
          onChange={(e) =>
            updateBillingForm({
              ...billingForm,
              cardName: {
                ...billingForm.cardName,
                value: e.target.value,
              },
            })
          }
        />
      </div>
      <div
        className={classNames("form-field", {
          "card-error": !!cardErrors.cardExpiry,
        })}
        data-line-count="2"
      >
        <div id="card-expiry-element" data-line-count="1"></div>
        <Alert
          className="invalid-message"
          message={cardErrors.cardExpiry}
          type="error"
        />
      </div>
      <div
        className={classNames("form-field", {
          "card-error": !!cardErrors.cardCvc,
        })}
        data-line-count="2"
      >
        <div id="card-cvv-element" data-line-count="1"></div>
        <Alert
          className="invalid-message"
          message={cardErrors.cardCvc}
          type="error"
        />
      </div>
    </form>
  );
}

export default Ui;
