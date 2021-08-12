import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ShopOutlined } from "@ant-design/icons";
import { Typography, Select, Tooltip, Button, Input, message } from "antd";
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
  ItemContainer,
  ItemImage,
  ItemTitleMetaContainer,
  ItemMeta,
  ItemSubtotal,
  ItemSubtotalBinContainer,
  LeftCheckoutContainer,
  CheckoutInnerSectionContainer,
  CartFooter,
  ItemTotal,
  TotalLabel,
  GSTLabel,
  ItemTotalContainer,
  EmptyCartMessage,
} from "./styles";
import { gdayfetch } from "utils/gdayfetch";
import { getGdayPunchStaticUrl, getImageModule } from "utils/utils";

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
  const [checkoutForm, updateCheckoutForm] = useState({
    email: undefined,
    firstName: undefined,
    lastName: undefined,
    address1: undefined,
    address2: undefined,
    city: undefined,
    state: undefined,
    postcode: undefined,
    province: undefined,
    country: locale || "AU",
    company: undefined,
    phone: undefined,
  });

  useEffect(() => {
    const checkoutFormRoot = document.getElementById("checkout-root");

    if (!countriesDownloaded && checkoutFormRoot && locale) {
      AddressForm(document.getElementById("checkout-root"), locale);
      updateCountriesDownloaded(true);
    }
  }, [countriesDownloaded, locale]);

  useEffect(() => {
    if (!locale && !fetchingLocale) {
      const getCountry = async () => {
        const res = await axios.get("https://geolocation-db.com/json/");
        const country = res.data.country_code;
        setLocale(country);
        updateFetchingLocale(true);
        updateCheckoutForm({
          ...checkoutForm,
          country,
        });
      };
      getCountry();
    }
  }, [locale, fetchingLocale]);

  window.onscroll = () => scrollFunction();

  const scrollFunction = () => {
    if (
      document.body.scrollTop > 50 ||
      document.documentElement.scrollTop > 50
    ) {
      document.getElementById("navbar").style.minHeight = "8vh";
      document.getElementById("navbar").style.fontSize = "14px";
    } else {
      document.getElementById("navbar").style.minHeight = "11.5vh";
      document.getElementById("navbar").style.fontSize = "15px";
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
            <LeftCheckoutContainer>
              <CheckoutInnerSectionContainer
                selectImage={getImageModule("down-arrow.png")}
              >
                <label>Customer Details</label>
                <br />
                <form id="checkout-root">
                  <div className="form-field">
                    <label htmlFor="AddressFirstName">First Name</label>
                    <input
                      type="text"
                      id="AddressFirstName"
                      name="address[first_name]"
                      value={checkoutForm.firstName}
                      onChange={(e) =>
                        updateCheckoutForm({
                          ...checkoutForm,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="AddressLastName">Last Name</label>
                    <input
                      type="text"
                      id="AddressLastName"
                      name="address[last_name]"
                      value={checkoutForm.lastName}
                      onChange={(e) =>
                        updateCheckoutForm({
                          ...checkoutForm,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="AddressCompany">Company</label>
                    <input
                      type="text"
                      id="AddressCompany"
                      name="address[company]"
                      value={checkoutForm.company}
                      onChange={(e) =>
                        updateCheckoutForm({
                          ...checkoutForm,
                          company: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="AddressAddress1">Address Line 1</label>
                    <input
                      type="text"
                      id="AddressAddress1"
                      name="address[address1]"
                      value={checkoutForm.address1}
                      onChange={(e) =>
                        updateCheckoutForm({
                          ...checkoutForm,
                          address1: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="AddressAddress2">Address Line 2</label>
                    <input
                      type="text"
                      id="AddressAddress2"
                      name="address[address2]"
                      value={checkoutForm.address2}
                      onChange={(e) =>
                        updateCheckoutForm({
                          ...checkoutForm,
                          address2: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="AddressCity">City</label>
                    <input
                      type="text"
                      id="AddressCity"
                      name="address[city]"
                      value={checkoutForm.city}
                      onChange={(e) =>
                        updateCheckoutForm({
                          ...checkoutForm,
                          city: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="AddressCountry">Country</label>
                    <select
                      id="AddressCountry"
                      name="address[country]"
                      data-default={checkoutForm.country}
                      onChange={(e) =>
                        updateCheckoutForm({
                          ...checkoutForm,
                          country: e.target.value,
                        })
                      }
                    ></select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="AddressProvince">Province</label>
                    <select
                      id="AddressProvince"
                      name="address[province]"
                      value={checkoutForm.province}
                      onChange={(e) =>
                        updateCheckoutForm({
                          ...checkoutForm,
                          province: e.target.value,
                        })
                      }
                    ></select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="AddressZip">Post Code</label>
                    <input
                      type="text"
                      id="AddressZip"
                      name="address[zip]"
                      value={checkoutForm.postcode}
                      onChange={(e) =>
                        updateCheckoutForm({
                          ...checkoutForm,
                          postcode: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="AddressPhone">Phone</label>
                    <input
                      type="tel"
                      id="AddressPhone"
                      name="address[phone]"
                      value={checkoutForm.phone}
                      onChange={(e) =>
                        updateCheckoutForm({
                          ...checkoutForm,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                </form>
                <CardElement options={CARD_ELEMENT_OPTIONS} />
              </CheckoutInnerSectionContainer>
              <CheckoutInnerSectionContainer>
                <label>Shipping Method</label>
              </CheckoutInnerSectionContainer>
              <CheckoutInnerSectionContainer>
                <label>Payment</label>
              </CheckoutInnerSectionContainer>
            </LeftCheckoutContainer>
            <OrderSummaryContainer>
              <OrderSummaryFixed>
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
                  <button onClick={() => handlePurchaseClick()}>Pay Now</button>
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
