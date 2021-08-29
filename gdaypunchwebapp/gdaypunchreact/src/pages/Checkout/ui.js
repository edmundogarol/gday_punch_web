import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ShopOutlined } from "@ant-design/icons";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { message } from "antd";
import axios from "axios";
import "unfetch/polyfill";
import "es6-promise/auto";

import { AddressForm } from "@shopify/theme-addresses";

import FeaturedSection from "components/featuredSection";
import BillingSection from "./billingSection";
import PaymentSection from "./paymentSection";
import ShippingSection from "./shippingSection";
import CustomerDetailsSection from "./customerDetailsSection";
import CartItem from "./cartItem";
import {
  App,
  CheckoutContainer,
  CheckoutHeader,
  SideCartItemsList,
  OrderSummaryContainer,
  OrderSummaryFixed,
  OrderSummaryLine,
  LeftCheckoutContainer,
  CheckoutInnerSectionContainer,
  CheckoutInnerSectionTitle,
  SubscribeCondition,
  PaymentMethodLogo,
  CartFooter,
  ItemTotal,
  TotalLabel,
  GSTLabel,
  ItemTotalContainer,
  EmptyCartMessage,
} from "./styles";
import { gdayfetch } from "utils/gdayfetch";
import {
  getResourceImageModule,
  getImageModule,
  phoneValidator,
} from "utils/utils";

function Ui(props) {
  const {
    paymentSubmit,
    paymentIntentFetch,
    paymentIntentCancel,
    customerSubscribe,
    clientSecret,
    toggleSideCart,
    cartTotal,
    viewProduct,
    productList: cartItemsObject,
  } = props;
  const [countriesDownloaded, updateCountriesDownloaded] = useState(false);
  const [checkoutForm, updateCheckoutForm] = useState({
    type: "shipping",
    formOpen: true,
    locale: undefined,
    fetchingLocale: false,
    email: { value: "", error: undefined },
    firstName: { value: "", error: undefined },
    lastName: { value: "", error: undefined },
    address1: { value: "", error: undefined },
    address2: { value: "", error: undefined },
    city: { value: "", error: undefined },
    postcode: { value: "", error: undefined },
    province: { value: "", error: undefined },
    country: { value: "AU", error: undefined },
    company: { value: "", error: undefined },
    phone: { value: "", error: undefined },
  });
  const [billingForm, updateBillingForm] = useState({
    type: "billing",
    formOpen: false,
    locale: undefined,
    fetchingLocale: false,
    email: { value: "", error: undefined },
    cardName: { value: "", error: undefined },
    firstName: { value: "", error: undefined },
    lastName: { value: "", error: undefined },
    address1: { value: "", error: undefined },
    address2: { value: "", error: undefined },
    city: { value: "", error: undefined },
    postcode: { value: "", error: undefined },
    province: { value: "", error: undefined },
    country: { value: "AU", error: undefined },
    phone: { value: "", error: undefined },
  });
  const [subscribeAgreed, toggleSubscribeAgreed] = useState(false);
  const [useShippingDetails, toggleUseShippingDetails] = useState(true);
  const [shippingMethodOpen, toggleShippingMethod] = useState(false);
  const [paymentOpen, togglePayment] = useState(false);

  const [submitting, toggleSubmitting] = useState(false);

  const freeShipping = checkoutForm.country.value === "AU";

  const stripe = useStripe();
  const elements = useElements();

  const customerDetailsPayload = {
    email: checkoutForm.email.value,
    first_name: checkoutForm.firstName.value,
    last_name: checkoutForm.lastName.value,
    address_line_1: checkoutForm.address1.value,
    address_line_2: checkoutForm.address2.value,
    city: checkoutForm.city.value,
    state: checkoutForm.province.value,
    postcode: checkoutForm.postcode.value,
    country: checkoutForm.country.value,
    phone_number: checkoutForm.phone.value,
  };

  const items = Object.values(cartItemsObject)
    .map((item) => item)
    .filter((item) => item.quantity);

  const populateAddressForm = (form) => {
    const addressRoot = document.getElementById(`${form.type}-address-root`);

    if (!addressRoot || !form.formOpen) return;

    if (!countriesDownloaded && form.locale) {
      AddressForm(addressRoot, form.locale);
      updateCountriesDownloaded(true);
    }
  };

  const fetchLocale = (form) => {
    const { locale, fetchingLocale } = form;
    const updateForm =
      form.type === "shipping" ? updateCheckoutForm : updateBillingForm;

    if (!locale && !fetchingLocale) {
      const getCountry = async () => {
        const res = await axios
          .get("https://geolocation-db.com/json/")
          .catch((e) => console.error(e));
        const country = res ? res.data.country_code : "AU";

        updateForm({
          ...form,
          locale: country,
          fetchingLocale: true,
          country: { ...form.country, value: country },
        });
      };

      getCountry();
    }
  };

  useEffect(() => {
    populateAddressForm(checkoutForm);
    populateAddressForm(billingForm);
  }, [
    useShippingDetails,
    countriesDownloaded,
    billingForm.formOpen,
    checkoutForm.formOpen,
    billingForm.locale,
    checkoutForm.locale,
  ]);

  useEffect(() => {
    fetchLocale(checkoutForm);
    fetchLocale(billingForm);
  }, [checkoutForm.locale, billingForm.locale]);

  window.onscroll = () => scrollFunction();

  const scrollFunction = () => {
    const minimiseHeader =
      document.body.scrollTop > 50 || document.documentElement.scrollTop > 50;

    // Change header size
    if (minimiseHeader) {
      document.getElementById("navbar").style.minHeight = "8vh";
      document.getElementById("navbar").style.fontSize = "14px";
    } else {
      document.getElementById("navbar").style.minHeight = "11.5vh";
      document.getElementById("navbar").style.fontSize = "15px";
    }

    // Handle order summary style
    const orderSummaryCont = document.getElementById("order-summary");
    const checkoutCont = document.getElementById("left-checkout-container");

    if (!orderSummaryCont || !checkoutCont) return;

    const checkoutContSmaller =
      checkoutCont.offsetHeight < orderSummaryCont.offsetHeight;

    if (minimiseHeader) {
      if (orderSummaryCont.style.position !== "fixed" && !checkoutContSmaller) {
        orderSummaryCont.style.position = "fixed";
        orderSummaryCont.style.bottom = "unset";
        orderSummaryCont.style.top = "8em";
      }
    } else {
      orderSummaryCont.style.position = "initial";
    }

    const checkoutContBottom = checkoutCont.getBoundingClientRect().bottom;

    if (
      checkoutContBottom <= document.documentElement.clientHeight &&
      !checkoutContSmaller
    ) {
      orderSummaryCont.style.position = "absolute";
      orderSummaryCont.style.bottom = "0";
      orderSummaryCont.style.top = "unset";
    } else if (checkoutContSmaller) {
      orderSummaryCont.style.background = "initial";
    }
  };

  const handleSubscribeCheck = (e) => {
    toggleSubscribeAgreed(e.target.checked);
  };

  const handleViewProduct = (product) => {
    viewProduct(product.id);
    toggleSideCart(false);
    const perma_link = product.title.toLowerCase().split(" ").join("-");
    props.history.push(`/product/${product.id}/${perma_link}`);
  };

  const handleSubmitPayment = async (ev) => {
    ev.preventDefault();

    let stripe_prices = [];
    items.map((item) => {
      return item.stripe_prices.map((price) => {
        stripe_prices = [
          ...stripe_prices,
          ...Array.from({ length: item.quantity }).map((x) => price),
        ];
      });
    });

    if (stripe_prices.length) {
      paymentSubmit(customerDetailsPayload, stripe_prices);
    }
  };

  const processPayment = async () => {
    const cardNumber = elements.getElement("cardNumber");

    const response = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardNumber,
        billing_details: {
          name: `${billingForm.firstName.value} ${billingForm.lastName.value}`,
          email: billingForm.email.value,
          phone: billingForm.phone.value,
          address: {
            city: billingForm.city.value,
            country: billingForm.country.value,
            line1: billingForm.address1.value,
            line2: billingForm.address2.value,
            postal_code: billingForm.postcode.value,
            state: billingForm.province.value,
          },
        },
      },
    });

    console.log({ response });

    if (response.error) {
      message.error({
        content: `Payment Failed: ${response.error.message}`,
        className: "antd-message-capitalize",
      });
    } else {
      message.success({
        content: "Payment Successful.",
        className: "antd-message-capitalize",
      });
    }
  };

  useEffect(() => {
    if (clientSecret) {
      processPayment();
    }
  }, [clientSecret]);

  const handlePurchaseClick = async () => {
    const response = await gdayfetch("payments/create-checkout-session/", {
      method: "POST",
      body: {},
    });

    if (response && response.ok) {
      const result = await stripe.redirectToCheckout({
        sessionId: response.data.id,
      });

      if (result.error) {
        alert(result.error.message);
      }
    } else {
      console.log("Checkout Purchase error", JSON.stringify(response));
      message.error({
        content: "Checkout Purchase error",
        className: "antd-message-capitalize",
        style: {
          textTransform: "capitalize",
        },
      });
    }
  };

  const validateForm = (form) => {
    const doNotValidate = [
      "type",
      "formOpen",
      "locale",
      "fetchingLocale",
      "cardName",
      "company",
      "address2",
    ];

    if (!form.formOpen) return true;
    if (form.type === "billing" && form.formOpen && useShippingDetails)
      return true;

    const updater =
      form.type === "shipping" ? updateCheckoutForm : updateBillingForm;
    let updatingForm = form;

    Object.keys(updatingForm).map((key) => {
      if (doNotValidate.includes(key)) return;

      const empty = !updatingForm[key].value.length;
      let validator = undefined;

      if (key === "phone") {
        validator = phoneValidator;
      }
      const invalid =
        !empty && validator && !validator(updatingForm[key].value);

      let currentError = empty ? "empty" : undefined;
      currentError = invalid ? "invalid-format" : currentError;

      updatingForm = {
        ...updatingForm,
        [key]: {
          ...updatingForm[key],
          error: currentError,
        },
      };
    });

    updater(updatingForm);

    const errors = Object.values(updatingForm)
      .map((field) => field.error)
      .filter((error) => error !== undefined);

    return !errors.length;
  };

  const handleOpenSection = (section) => {
    const validForms = validateForm(checkoutForm) && validateForm(billingForm);

    if (validForms) {
      updateCheckoutForm({
        ...checkoutForm,
        formOpen: section === "customer",
      });
      updateBillingForm({
        ...billingForm,
        formOpen: section === "billing",
      });
      toggleShippingMethod(section === "shipping");
      togglePayment(section === "payment");
    }

    if (
      subscribeAgreed &&
      validForms &&
      checkoutForm.formOpen &&
      section !== "customer"
    ) {
      customerSubscribe({
        user: null,
        subscribed: "checkout_subscribed",
        ...customerDetailsPayload,
      });
    }

    updateCountriesDownloaded(false);
  };

  return (
    <App id="top" className="App">
      <FeaturedSection top width={"90%"} height={"70vh"}>
        <CheckoutHeader>
          <h3>Secure Checkout</h3>
        </CheckoutHeader>
        {items.length < 1 ? (
          <EmptyCartMessage>
            <h4>Empty Cart</h4>
            <div>
              <h2 onClick={() => props.history.push("/shop")}>Shop now!</h2>
              <ShopOutlined className="site-form-item-icon" />
            </div>
          </EmptyCartMessage>
        ) : (
          <CheckoutContainer>
            <LeftCheckoutContainer id="left-checkout-container">
              <CheckoutInnerSectionContainer
                selectImage={getImageModule("down-arrow.png")}
              >
                <CheckoutInnerSectionTitle>
                  Customer Details
                  {!checkoutForm.formOpen && (
                    <span onClick={() => handleOpenSection("customer")}>
                      Edit
                    </span>
                  )}
                </CheckoutInnerSectionTitle>
                <br />
                <CustomerDetailsSection
                  checkoutForm={checkoutForm}
                  updateCheckoutForm={updateCheckoutForm}
                  subscribeAgreed={subscribeAgreed}
                  handleSubscribeCheck={handleSubscribeCheck}
                  handleOpenSection={handleOpenSection}
                />
              </CheckoutInnerSectionContainer>
              <CheckoutInnerSectionContainer>
                <CheckoutInnerSectionTitle>
                  Shipping Method
                  {!shippingMethodOpen && (
                    <span onClick={() => handleOpenSection("shipping")}>
                      Edit
                    </span>
                  )}
                </CheckoutInnerSectionTitle>
                <br />
                <ShippingSection
                  shippingMethodOpen={shippingMethodOpen}
                  freeShipping={freeShipping}
                  handleOpenSection={handleOpenSection}
                />
              </CheckoutInnerSectionContainer>
              <CheckoutInnerSectionContainer
                selectImage={getImageModule("down-arrow.png")}
              >
                <CheckoutInnerSectionTitle>
                  Billing Address
                  {!billingForm.formOpen && (
                    <span onClick={() => handleOpenSection("billing")}>
                      Edit
                    </span>
                  )}
                </CheckoutInnerSectionTitle>
                <br />
                <BillingSection
                  billingForm={billingForm}
                  useShippingDetails={useShippingDetails}
                  toggleUseShippingDetails={toggleUseShippingDetails}
                  updateCountriesDownloaded={updateCountriesDownloaded}
                  updateBillingForm={updateBillingForm}
                  handleOpenSection={handleOpenSection}
                />
              </CheckoutInnerSectionContainer>
              <CheckoutInnerSectionContainer>
                <CheckoutInnerSectionTitle>
                  Payment
                  <span className="no-hover">
                    <PaymentMethodLogo
                      src={getResourceImageModule("visa-logo.png")}
                    />
                    <PaymentMethodLogo
                      src={getResourceImageModule("master-card-logo.png")}
                    />
                  </span>
                </CheckoutInnerSectionTitle>
                <br />
                <PaymentSection
                  paymentOpen={paymentOpen}
                  billingForm={billingForm}
                  updateBillingForm={updateBillingForm}
                />
              </CheckoutInnerSectionContainer>
            </LeftCheckoutContainer>
            <OrderSummaryContainer>
              <OrderSummaryFixed id="order-summary">
                <label>Order Summary</label>
                <SideCartItemsList>
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      handleViewProduct={handleViewProduct}
                    />
                  ))}
                </SideCartItemsList>
                <ItemTotalContainer>
                  <NavLink target="_blank" to="/refunds-and-returns">
                    <p className="website">Refunds & Returns Policy</p>
                  </NavLink>
                  <div>
                    <ItemTotal>
                      <TotalLabel>Total:</TotalLabel>
                      <h3>A${cartTotal.toFixed(2)}</h3>
                    </ItemTotal>
                    <GSTLabel>[Price Includes GST]</GSTLabel>
                  </div>
                </ItemTotalContainer>
                <CartFooter>
                  <button
                    onClick={(ev) => {
                      toggleSubmitting(true);
                      console.log({ checkoutForm, billingForm });
                      handleSubmitPayment(ev);
                    }}
                  >
                    Pay Now
                  </button>
                </CartFooter>
              </OrderSummaryFixed>
            </OrderSummaryContainer>
          </CheckoutContainer>
        )}
      </FeaturedSection>
    </App>
  );
}

export default Ui;
