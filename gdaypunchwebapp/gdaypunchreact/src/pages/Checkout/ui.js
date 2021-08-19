import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ShopOutlined } from "@ant-design/icons";
import { Typography, Select, Tooltip, Button, Radio, message } from "antd";
import classNames from "classnames";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import "unfetch/polyfill";
import "es6-promise/auto";

import { AddressForm } from "@shopify/theme-addresses";

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
  getImageModule,
  phoneValidator,
} from "utils/utils";

const { Title } = Typography;
const { Option } = Select;

const stripePromise = loadStripe(
  process.env.NODE_ENV === "development"
    ? "pk_test_QgTiwo4w3EXdQS9hOywypRAF"
    : "pk_live_mTfZz6d7N3Lm44Wgqbzn24Tf"
);

const CARD_ELEMENT_OPTIONS = {
  style: {
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
  const [fetchingLocale, updateFetchingLocale] = useState(false);
  const [locale, setLocale] = useState(undefined);
  const [submitting, toggleSubmitting] = useState(false);
  const [checkoutForm, updateCheckoutForm] = useState({
    email: { value: "", error: undefined },
    firstName: { value: "", error: undefined },
    lastName: { value: "", error: undefined },
    address1: { value: "", error: undefined },
    address2: { value: "", error: undefined },
    city: { value: "", error: undefined },
    postcode: { value: "", error: undefined },
    province: { value: "", error: undefined },
    country: { value: locale || "AU", error: undefined },
    company: { value: "", error: undefined },
    phone: { value: "", error: undefined },
  });
  const [provinceCode, setProvinceCode] = useState("");
  const [customerDetailsOpen, toggleCustomerDetails] = useState(true);
  const [shippingMethodOpen, toggleShippingMethod] = useState(false);

  useEffect(() => {
    const checkoutFormRoot = document.getElementById("checkout-root");

    if (
      customerDetailsOpen &&
      !countriesDownloaded &&
      checkoutFormRoot &&
      locale
    ) {
      AddressForm(document.getElementById("checkout-root"), locale);
      updateCountriesDownloaded(true);
    }
  }, [customerDetailsOpen, countriesDownloaded, locale]);

  useEffect(() => {
    if (!locale && !fetchingLocale) {
      const getCountry = async () => {
        const res = await axios
          .get("https://geolocation-db.com/json/")
          .catch((e) => console.error(e));
        const country = res ? res.data.country_code : "AU";
        setLocale("US");
        updateFetchingLocale(true);
        updateCheckoutForm({
          ...checkoutForm,
          country: { ...checkoutForm.country, value: country },
        });
      };
      getCountry();
    }
  }, [locale, fetchingLocale]);

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
    const stripe = await stripePromise;
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

  const handleUpdateCheckoutForm = (field, e) => {
    // Value
    let value = e.target.value;

    if (field === "province") {
      const select = e.target;
      setProvinceCode(value);
      value = select.options[select.selectedIndex].text;
    }

    // Error
    const empty = !value.length;
    let validator = undefined;

    if (field === "phone") {
      validator = phoneValidator;
    }

    const invalid = !empty && validator && !validator(value);

    let currentError = empty ? "empty" : undefined;
    currentError = invalid ? "invalid-format" : currentError;

    updateCheckoutForm({
      ...checkoutForm,
      [field]: {
        value,
        error: currentError,
      },
    });
  };

  const validateCheckoutForm = () => {
    let updatingForm = checkoutForm;

    Object.keys(updatingForm).map((key) => {
      const empty = !updatingForm[key].value.length;
      let validator = undefined;

      if (key === "phone") {
        validator = phoneValidator;
      }
      const invalid =
        !empty && validator && !validator(updatingForm[key].value);

      if (key !== "company") {
        let currentError = empty ? "empty" : undefined;
        currentError = invalid ? "invalid-format" : currentError;

        updatingForm = {
          ...updatingForm,
          [key]: {
            ...updatingForm[key],
            error: currentError,
          },
        };
      }
    });

    updateCheckoutForm(updatingForm);

    const errors = Object.values(updatingForm)
      .map((field) => field.error)
      .filter((error) => error !== undefined);

    return !errors.length;
  };

  const handleCustomerDetailsNext = (validated) => {
    if (validated) toggleCustomerDetails(false);
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
                  Customer Details{" "}
                  {!customerDetailsOpen && (
                    <span onClick={() => toggleCustomerDetails(true)}>
                      Edit
                    </span>
                  )}
                </CheckoutInnerSectionTitle>
                <br />
                {customerDetailsOpen ? (
                  <>
                    <form id="checkout-root" data-address="checkout-root">
                      <div
                        className={classNames(
                          "form-field",
                          checkoutForm.email.error
                        )}
                        data-line-count="1"
                      >
                        <label>Email</label>
                        <input
                          type="text"
                          id="AddressEmail"
                          name="address[email]"
                          value={checkoutForm.email.value}
                          onChange={(e) => handleUpdateCheckoutForm("email", e)}
                        />
                      </div>

                      <div
                        className={classNames(
                          "form-field",
                          checkoutForm.firstName.error
                        )}
                        data-line-count="2"
                      >
                        <label htmlFor="AddressFirstName">First Name</label>
                        <input
                          type="text"
                          id="AddressFirstName"
                          name="address[first_name]"
                          value={checkoutForm.firstName.value}
                          onChange={(e) =>
                            handleUpdateCheckoutForm("firstName", e)
                          }
                        />
                      </div>

                      <div
                        className={classNames(
                          "form-field",
                          checkoutForm.lastName.error
                        )}
                        data-line-count="2"
                      >
                        <label htmlFor="AddressLastName">Last Name</label>
                        <input
                          type="text"
                          id="AddressLastName"
                          name="address[last_name]"
                          value={checkoutForm.lastName.value}
                          onChange={(e) =>
                            handleUpdateCheckoutForm("lastName", e)
                          }
                        />
                      </div>

                      <div className="form-field" data-line-count="1">
                        <label htmlFor="AddressCompany">Company</label>
                        <input
                          type="text"
                          id="AddressCompany"
                          name="address[company]"
                          value={checkoutForm.company.value}
                          onChange={(e) =>
                            handleUpdateCheckoutForm("company", e)
                          }
                        />
                      </div>

                      <div
                        className={classNames(
                          "form-field",
                          checkoutForm.address1.error
                        )}
                        data-line-count="1"
                      >
                        <label htmlFor="AddressAddress1">Address Line 1</label>
                        <input
                          type="text"
                          id="AddressAddress1"
                          name="address[address1]"
                          value={checkoutForm.address1.value}
                          onChange={(e) =>
                            handleUpdateCheckoutForm("address1", e)
                          }
                        />
                      </div>

                      <div className="form-field" data-line-count="1">
                        <label htmlFor="AddressAddress2">Address Line 2</label>
                        <input
                          type="text"
                          id="AddressAddress2"
                          name="address[address2]"
                          value={checkoutForm.address2.value}
                          onChange={(e) =>
                            handleUpdateCheckoutForm("address2", e)
                          }
                        />
                      </div>

                      <div
                        className={classNames(
                          "form-field",
                          checkoutForm.city.error
                        )}
                        data-line-count="1"
                      >
                        <label htmlFor="AddressCity">City</label>
                        <input
                          type="text"
                          id="AddressCity"
                          name="address[city]"
                          value={checkoutForm.city.value}
                          onChange={(e) => handleUpdateCheckoutForm("city", e)}
                        />
                      </div>

                      <div
                        className={classNames(
                          "form-field",
                          checkoutForm.country.error
                        )}
                        data-line-count="3"
                      >
                        <label htmlFor="AddressCountry">Country</label>
                        <select
                          id="AddressCountry"
                          name="address[country]"
                          data-default={checkoutForm.country.value}
                          onChange={(e) =>
                            handleUpdateCheckoutForm("country", e)
                          }
                        >
                          <option value="AU">Australia</option>
                          <option value="US">United States</option>
                          <option value="NZ">New Zealand</option>
                          <option value="JP">Japan</option>
                          <option value="GB">United Kingdom</option>
                          <option disabled>_ _ _ _ _ _ _ _ _</option>
                        </select>
                      </div>

                      <div
                        className={classNames(
                          "form-field",
                          checkoutForm.province.error
                        )}
                        data-line-count="3"
                      >
                        <label htmlFor="AddressProvince">Province</label>
                        <select
                          id="AddressProvince"
                          name="address[province]"
                          value={provinceCode || checkoutForm.province.value}
                          data-default={provinceCode}
                          onMouseUp={(e) =>
                            handleUpdateCheckoutForm("province", e)
                          }
                          onChange={(e) => {
                            handleUpdateCheckoutForm("province", e);
                          }}
                        ></select>
                      </div>

                      <div
                        className={classNames(
                          "form-field",
                          checkoutForm.postcode.error
                        )}
                        data-line-count="3"
                      >
                        <label htmlFor="AddressZip">Post Code</label>
                        <input
                          type="text"
                          id="AddressZip"
                          name="address[zip]"
                          value={checkoutForm.postcode.value}
                          onChange={(e) =>
                            handleUpdateCheckoutForm("postcode", e)
                          }
                        />
                      </div>

                      <div
                        className={classNames(
                          "form-field",
                          checkoutForm.phone.error
                        )}
                        data-line-count="1"
                      >
                        <label htmlFor="AddressPhone">Phone</label>
                        <input
                          type="tel"
                          id="AddressPhone"
                          name="address[phone]"
                          value={checkoutForm.phone.value}
                          onChange={(e) => handleUpdateCheckoutForm("phone", e)}
                        />
                        <label className="invalid-message">
                          Please enter a valid phone number
                        </label>
                      </div>
                    </form>
                    <button
                      onClick={() => {
                        handleCustomerDetailsNext(validateCheckoutForm());
                      }}
                    >
                      Next
                    </button>
                  </>
                ) : (
                  <>
                    <OrderSummaryLine>
                      <label className="summary-line-label">Contact</label>
                      <div>{`${checkoutForm.email.value}`}</div>
                      <div>{`${checkoutForm.phone.value}`}</div>
                    </OrderSummaryLine>
                    <SummaryLineSeparator />
                    <OrderSummaryLine>
                      <label className="summary-line-label">Ship to</label>
                      <div>{`${checkoutForm.address1.value} ${checkoutForm.address2.value}, ${checkoutForm.city.value} ${checkoutForm.province.value} ${checkoutForm.postcode.value}, ${checkoutForm.country.value}`}</div>
                    </OrderSummaryLine>
                  </>
                )}
              </CheckoutInnerSectionContainer>
              <CheckoutInnerSectionContainer>
                <CheckoutInnerSectionTitle>
                  Shipping Method
                </CheckoutInnerSectionTitle>
                <br />
                <OrderSummaryLine singleLine>
                  <div>
                    <Radio buttonStyle={{ color: "dimgrey" }} checked />{" "}
                    {`Free Standard Shipping Worldwide`}
                  </div>
                </OrderSummaryLine>
              </CheckoutInnerSectionContainer>
              <CheckoutInnerSectionContainer>
                <label>Payment</label>
                <CardElement options={CARD_ELEMENT_OPTIONS} />
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
                      console.log({ checkoutForm });
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
