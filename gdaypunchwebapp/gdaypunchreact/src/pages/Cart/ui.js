import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  ShoppingCartOutlined,
  ShopOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Select, Tooltip, Button, Input, message } from "antd";

import LoadingSpinner from "components/loadingSpinner";
import FeaturedSection from "components/featuredSection";
import { SectionTitle } from "components/sectionTitle";
import {
  App,
  SideCartHeader,
  SideCartItemsList,
  ItemContainer,
  ItemImage,
  ItemTitleMetaContainer,
  ItemMeta,
  ItemSubtotal,
  ItemSubtotalBinContainer,
  CartFooter,
  ItemCoupon,
  ItemTotal,
  TotalLabel,
  GSTLabel,
  ItemTotalContainer,
  SideCartCheckoutButton,
  EmptyCartMessage,
  CheckoutButtonContainer,
} from "./styles";
import { getGdayPunchStaticUrl } from "utils/utils";

const { Option } = Select;

function Ui(props) {
  const {
    paymentState: { coupon, applyingCoupon, applyingCouponFinished },
    updateCoupon,
    applyCoupon,
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

  const handleViewProduct = (product) => {
    viewProduct(product.id);
    toggleSideCart(false);
    const perma_link = product.title.toLowerCase().split(" ").join("-");
    props.history.push(`/product/${product.id}/${perma_link}`);
  };

  const cartItem = (item) => {
    const { id, image, title, product_type, active_price, quantity } = item;
    const digitalProduct = product_type !== "physical";
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
              onSelect={(value) =>
                updateCartItemQuantity(id, value, false, false)
              }
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
    <App id="top" className="App">
      <FeaturedSection top width={"90%"} height={"70vh"}>
        <SideCartHeader>
          <SectionTitle>
            Cart
            <ShoppingCartOutlined className="site-form-item-icon" />
          </SectionTitle>
          <p>{cartCount}</p>
        </SideCartHeader>
        {items.length < 1 ? (
          <EmptyCartMessage>
            <h4>Empty Cart</h4>
            <div>
              <h2 onClick={() => props.history.push("/shop")}>Shop now!</h2>
              <ShopOutlined className="site-form-item-icon" />
            </div>
          </EmptyCartMessage>
        ) : (
          <>
            <SideCartItemsList>
              {items.map((item) => cartItem(item))}
            </SideCartItemsList>
            <CartFooter>
              <ItemCoupon>
                {applyingCoupon ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <Input
                      value={coupon.name}
                      placeholder="Enter Coupon Code"
                      onChange={(e) =>
                        updateCoupon({
                          ...coupon,
                          name: e.target.value.toUpperCase(),
                        })
                      }
                    />
                    <Button onClick={() => applyCoupon(coupon)}>
                      Apply Discount
                    </Button>
                  </>
                )}
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
              <CheckoutButtonContainer>
                <SideCartCheckoutButton
                  onClick={() => {
                    props.history.push("/checkout");
                  }}
                >
                  Checkout
                </SideCartCheckoutButton>
              </CheckoutButtonContainer>
            </CartFooter>
          </>
        )}
      </FeaturedSection>
    </App>
  );
}

export default Ui;
