import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import {
  ShoppingCartOutlined,
  VerticalAlignTopOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { loadStripe } from "@stripe/stripe-js";
import { gdayfetch } from "utils/gdayfetch";

import { Typography, Select, Tooltip, Button, Input, message } from "antd";
import {
  SideCartContainer,
  SideCartHeader,
  CloseSideCart,
  SideCartBlurField,
  SideCartItemsList,
  ItemContainer,
  ItemImage,
  ItemTitleMetaContainer,
  ItemMeta,
  ItemSubtotal,
  ItemSubtotalBinContainer,
  ItemCoupon,
  ItemTotal,
  TotalLabel,
  GSTLabel,
  ItemTotalContainer,
  SideCartCheckoutButton,
} from "./styles";

import { getGdayPunchStaticUrl } from "utils/utils";
import { faDoorClosed } from "node_modules/@fortawesome/free-solid-svg-icons/index";

const { Title } = Typography;
const { Option } = Select;

const stripePromise = loadStripe(
  process.env.NODE_ENV === "development"
    ? "pk_test_QgTiwo4w3EXdQS9hOywypRAF"
    : "pk_live_mTfZz6d7N3Lm44Wgqbzn24Tf"
);

function Ui(props) {
  const {
    cartState,
    cartCount,
    toggleSideCart,
    updateCartItemQuantity,
    removeCartItem,
    cartTotal,
  } = props;
  const { items: cartItemsObject, sideCartOpen } = cartState;
  const items = Object.values(cartItemsObject).map((item) => item);

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

  const productTypeString = {
    1: "Physical",
    2: "Digital",
    3: "Subscription",
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
    const { id, image, title, product_type, price, quantity } = item;
    return (
      <ItemContainer key={id}>
        <ItemImage src={getGdayPunchStaticUrl(image)} />
        <ItemTitleMetaContainer>
          <h3>{title}</h3>
          <ItemMeta>
            <p>{`A$${price}`}</p>
            <p className="spacer">QTY:</p>
            <Select
              value={quantity}
              onSelect={(value) => updateCartItemQuantity(id, value)}
              defaultValue={1}
            >
              {[...Array(10)].map((x, i) => (
                <Option key={i + 1} value={i + 1}>
                  {i + 1}
                </Option>
              ))}
            </Select>
          </ItemMeta>
        </ItemTitleMetaContainer>
        <ItemSubtotalBinContainer>
          <ItemSubtotal>
            <h4>{`A$${quantity ? quantity * price : price}`}</h4>
            <p>Subtotal</p>
          </ItemSubtotal>
          <Tooltip title="Remove Item from Cart">
            <Button onClick={() => removeCartItem(id)}>
              <DeleteOutlined className="site-form-item-icon" />
            </Button>
          </Tooltip>
        </ItemSubtotalBinContainer>
      </ItemContainer>
    );
  };

  return (
    <>
      <SideCartBlurField
        sideCartOpen={sideCartOpen}
        onClick={() => toggleSideCart(false)}
      />
      <SideCartContainer
        className={`side-cart ${sideCartOpen ? "side-cart-open" : ""}`}
      >
        <SideCartHeader>
          <CloseSideCart onClick={() => toggleSideCart(false)}>
            <VerticalAlignTopOutlined className="site-form-item-icon" />
          </CloseSideCart>
          <Title level={4}>
            Cart
            <ShoppingCartOutlined className="site-form-item-icon" />
          </Title>
          <p>{cartCount}</p>
        </SideCartHeader>
        <SideCartItemsList>
          {items.map((item) => cartItem(item))}
        </SideCartItemsList>
        <ItemCoupon>
          <Input placeholder="Enter Coupon Code" />
          <Button>Apply Discount</Button>
        </ItemCoupon>
        <ItemTotalContainer>
          <a
            target="_blank"
            href="https://www.gdaypunch.com/return-and-refund-policy.html"
          >
            <p className="website">Refunds & Returns Policy</p>
          </a>
          <div>
            <ItemTotal>
              <TotalLabel>Total:</TotalLabel>
              <h3>A${cartTotal}</h3>
            </ItemTotal>
            <GSTLabel>[Price Includes GST]</GSTLabel>
          </div>
        </ItemTotalContainer>
        <SideCartCheckoutButton onClick={() => handlePurchaseClick()}>
          Checkout
        </SideCartCheckoutButton>
      </SideCartContainer>
    </>
  );
}

export default Ui;
