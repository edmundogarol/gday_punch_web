import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ShopOutlined } from "@ant-design/icons";
import { Typography, Select, Tooltip, Button, Input, message } from "antd";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement } from "@stripe/react-stripe-js";

import FeaturedSection from "components/featuredSection";
import {
  App,
  CheckoutContainer,
  CheckoutHeader,
  SideCartItemsList,
  OrderSummaryContainer,
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
import { getGdayPunchStaticUrl } from "utils/utils";

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
  const [checkoutForm, updateCheckoutForm] = useState({
    email: undefined,
    firstName: undefined,
    lastName: undefined,
    addressLine1: undefined,
    addressLine2: undefined,
    city: undefined,
    state: undefined,
    postcode: undefined,
    country: undefined,
    phone: undefined,
  });

  const items = Object.values(cartItemsObject)
    .map((item) => item)
    .filter((item) => item.quantity);

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
              <CheckoutInnerSectionContainer>
                <label>Customer Details</label>
                <br />
                <p>Email Address</p>
                <Input
                  value={checkoutForm.email}
                  onChange={(e) => updateCheckoutForm(e.target.value)}
                />
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
            </OrderSummaryContainer>
          </CheckoutContainer>
        )}
      </FeaturedSection>
    </App>
  );
}

export default Ui;
