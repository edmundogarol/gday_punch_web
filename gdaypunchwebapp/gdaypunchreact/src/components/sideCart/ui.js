import React from "react";
import { NavLink } from "react-router-dom";
import {
  ShoppingCartOutlined,
  VerticalAlignTopOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Typography, Select, Tooltip, Button, Input, message } from "antd";
import { loadStripe } from "@stripe/stripe-js";

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
import { gdayfetch } from "utils/gdayfetch";

const { Title } = Typography;
const { Option } = Select;

const stripePromise = loadStripe(
  process.env.NODE_ENV === "development"
    ? "pk_test_QgTiwo4w3EXdQS9hOywypRAF"
    : "pk_live_mTfZz6d7N3Lm44Wgqbzn24Tf"
);

function Ui(props) {
  const {
    cartState: { sideCartOpen },
    cartCount,
    toggleSideCart,
    updateCartItemQuantity,
    removeCartItem,
    cartTotal,
    viewProduct,
    productList: cartItemsObject,
  } = props;

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
    const digitalProduct = product_type !== 1;
    const qtyRange = digitalProduct && quantity ? 1 : 10;

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
            <Select
              value={quantity}
              onSelect={(value) => updateCartItemQuantity(id, value)}
              defaultValue={1}
            >
              {[...Array(qtyRange)].map((x, i) => (
                <Option key={i + 1} value={i + 1}>
                  {i + 1}
                </Option>
              ))}
            </Select>
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
          <NavLink to="/cart" onClick={() => toggleSideCart(false)}>
            Edit Cart
          </NavLink>
        </SideCartHeader>
        <SideCartItemsList>
          {items.map((item) => cartItem(item))}
        </SideCartItemsList>
        <ItemCoupon>
          <Input placeholder="Enter Coupon Code" />
          <Button>Apply Discount</Button>
        </ItemCoupon>
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
        <SideCartCheckoutButton onClick={() => handlePurchaseClick()}>
          Checkout
        </SideCartCheckoutButton>
      </SideCartContainer>
    </>
  );
}

export default Ui;
