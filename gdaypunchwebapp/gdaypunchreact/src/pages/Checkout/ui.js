import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ShopOutlined } from "@ant-design/icons";
import {
  Typography,
  Select,
  Tooltip,
  Button,
  Space,
  Radio,
  message,
} from "antd";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import "unfetch/polyfill";
import "es6-promise/auto";

import { AddressForm } from "@shopify/theme-addresses";

import GPAddressForm from "./addressForm";
import FeaturedSection from "components/featuredSection";
import {
  App,
  CheckoutContainer,
  CheckoutHeader,
  SideCartItemsList,
  OrderSummaryContainer,
  OrderSummaryFixed,
  OrderSummaryLine,
  SummaryLineSeparator,
  ItemContainer,
  ItemImage,
  ItemTitleMetaContainer,
  ItemMeta,
  ItemSubtotal,
  ItemSubtotalBinContainer,
  LeftCheckoutContainer,
  CheckoutInnerSectionContainer,
  CheckoutInnerSectionTitle,
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
  getGdayPunchStaticUrl,
  getResourceImageModule,
  getImageModule,
  phoneValidator,
} from "utils/utils";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontSmoothing: "antialiased",
      fontSize: "1em",
      height: "2em",
      padding: "1em",
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
  const {
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
  const [useShippingDetails, toggleUseShippingDetails] = useState(true);
  const [shippingMethodOpen, toggleShippingMethod] = useState(false);
  const [paymentOpen, togglePayment] = useState(false);
  const [submitting, toggleSubmitting] = useState(false);

  const freeShipping = checkoutForm.country.value === "AU";

  const stripe = useStripe();
  const elements = useElements();

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

  useEffect(() => {
    if (!paymentOpen) return;

    const cardNumberElement = elements?.create("cardNumber", {
      placeholder: "Card number",
      ...CARD_ELEMENT_OPTIONS,
    });
    const cardExpiryElement = elements?.create("cardExpiry", {
      placeholder: "Expiration date (MM / YY)",
      ...CARD_ELEMENT_OPTIONS,
    });
    const cardCvvElement = elements?.create("cardCvc", {
      placeholder: "Security code",
      ...CARD_ELEMENT_OPTIONS,
    });

    cardNumberElement?.mount("#card-number-element");
    cardExpiryElement?.mount("#card-expiry-element");
    cardCvvElement?.mount("#card-cvv-element");

    return () => {
      if (cardNumberElement) {
        cardNumberElement.destroy();
        cardExpiryElement.destroy();
        cardCvvElement.destroy();
      }
    };
  }, [paymentOpen]);

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

  const handleViewProduct = (product) => {
    viewProduct(product.id);
    toggleSideCart(false);
    const perma_link = product.title.toLowerCase().split(" ").join("-");
    props.history.push(`/product/${product.id}/${perma_link}`);
  };

  const handlePurchaseClick = async () => {
    let stripe_prices = [];
    items.map((item) => {
      return item.stripe_prices.map((price) => {
        stripe_prices = [
          ...stripe_prices,
          ...Array.from({ length: item.quantity }).map((x) => price),
        ];
      });
    });

    const response = await gdayfetch("payments/create-checkout-session/", {
      method: "POST",
      body: {
        stripe_ids: stripe_prices,
      },
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

  const cartItem = (item) => {
    const { id, image, title, product_type, active_price, quantity } = item;

    return (
      <ItemContainer key={id}>
        <ItemImage src={getGdayPunchStaticUrl(image)} />
        <ItemTitleMetaContainer>
          <a onClick={() => handleViewProduct(item)}>
            <h3>{title}</h3>
          </a>
          <ItemMeta>
            <p>{`A$${active_price}`}</p>
            <p className="spacer">QTY:</p>
            {quantity}
          </ItemMeta>
        </ItemTitleMetaContainer>
        <ItemSubtotalBinContainer>
          <ItemSubtotal>
            <h4>{`A$${(quantity
              ? quantity * active_price
              : active_price
            ).toFixed(2)}`}</h4>
            <p>Subtotal</p>
          </ItemSubtotal>
        </ItemSubtotalBinContainer>
      </ItemContainer>
    );
  };

  const renderAddressSummary = (form) => {
    const addressTitle = form.type === "shipping" ? "Ship To" : "Address";
    return (
      <>
        <OrderSummaryLine>
          <label className="summary-line-label">Contact</label>
          <div>{`${form.email.value}`}</div>
          <div>{`${form.phone.value}`}</div>
        </OrderSummaryLine>
        <SummaryLineSeparator />
        <OrderSummaryLine>
          <label className="summary-line-label">{addressTitle}</label>
          <div>{`${form.address1.value} ${form.address2.value}, ${form.city.value} ${form.province.value} ${form.postcode.value}, ${form.country.value}`}</div>
        </OrderSummaryLine>
      </>
    );
  };

  const renderBillingView = () => {
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
  };

  const validateForm = (form) => {
    const doNotValidate = [
      "type",
      "formOpen",
      "locale",
      "fetchingLocale",
      "cardName",
      "company",
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

    updateCountriesDownloaded(false);
  };

  const items = Object.values(cartItemsObject)
    .map((item) => item)
    .filter((item) => item.quantity);

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
                {checkoutForm.formOpen ? (
                  <>
                    <GPAddressForm
                      type="shipping"
                      addressForm={checkoutForm}
                      updateAddressForm={updateCheckoutForm}
                    />
                    <button onClick={() => handleOpenSection("shipping")}>
                      Next
                    </button>
                  </>
                ) : (
                  renderAddressSummary(checkoutForm)
                )}
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
                {shippingMethodOpen ? (
                  <>
                    <OrderSummaryLine singleLine>
                      <Radio.Group
                        value={freeShipping ? "free" : "international"}
                      >
                        <Space direction="vertical">
                          <Radio value="free" disabled={!freeShipping}>
                            Australia Free Standard Shipping
                            <p>Free</p>
                          </Radio>
                          <Radio value="international" disabled={freeShipping}>
                            International Standard Shipping
                            <p>AUD$13.00</p>
                          </Radio>
                        </Space>
                      </Radio.Group>
                    </OrderSummaryLine>
                    <button onClick={() => handleOpenSection("billing")}>
                      Next
                    </button>
                  </>
                ) : (
                  <OrderSummaryLine singleLine>
                    <div>
                      {freeShipping ? (
                        <p>
                          Australia Free Standard Shipping<span>(Free)</span>
                        </p>
                      ) : (
                        <p>
                          International Standard Shipping
                          <span>(AUD$13.00)</span>
                        </p>
                      )}
                    </div>
                  </OrderSummaryLine>
                )}
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
                {billingForm.formOpen ? (
                  renderBillingView()
                ) : (
                  <>
                    {useShippingDetails ? (
                      <OrderSummaryLine singleLine>
                        <div>
                          <p>Same as shipping address</p>
                        </div>
                      </OrderSummaryLine>
                    ) : (
                      renderAddressSummary(billingForm)
                    )}
                  </>
                )}
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
                {paymentOpen && (
                  <>
                    <br />
                    <form id="card-form" data-address={`card-form-root`}>
                      <div id="card-number-element" data-line-count="1"></div>
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
                      <div id="card-expiry-element" data-line-count="2"></div>
                      <div id="card-cvv-element" data-line-count="2"></div>
                    </form>
                  </>
                )}
              </CheckoutInnerSectionContainer>
            </LeftCheckoutContainer>
            <OrderSummaryContainer>
              <OrderSummaryFixed id="order-summary">
                <label>Order Summary</label>
                <SideCartItemsList>
                  {items.map((item) => cartItem(item))}
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
                    onClick={() => {
                      toggleSubmitting(true);
                      console.log({ checkoutForm, billingForm });
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
