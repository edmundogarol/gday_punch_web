import React, { useState } from "react";
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
  ItemTileSubtotal,
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
import { getGdayPunchStaticUrl, generatePermaLink } from "utils/utils";
import { useScrollTop } from "utils/hooks/useScrollTop";

const { Option } = Select;

function Ui(props) {
  const {
    paymentState: { coupon, applyingCoupon, applyingCouponFinished },
    applyCoupon,
    cartCount,
    toggleSideCart,
    updateCartItemQuantity,
    removeCartItem,
    cartTotal,
    cartSubtotal,
    discountAmount,
    viewProduct,
    productList: cartItemsObject,
  } = props;
  const [submitCoupon, updateSubmitCoupon] = useState({
    name: "",
  });

  useScrollTop();

  const items = Object.values(cartItemsObject)
    .map((item) => item)
    .filter((item) => item.quantity);

  const handleViewProduct = (product) => {
    viewProduct(product.id);
    toggleSideCart(false);
    const perma_link = generatePermaLink(product);
    props.history.push(`/product/${product.id}/${perma_link}`);
  };

  const cartItem = (item) => {
    const {
      id,
      image,
      title,
      product_type,
      active_price,
      quantity,
      subscription_interval,
    } = item;
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
            <p>
              <span className="price">{`A$${active_price}`}</span>
              <span className="interval">
                {product_type.includes("subscription")
                  ? product_type === "mag_subscription"
                    ? "/ per release"
                    : `/ ${
                        subscription_interval < 2
                          ? "per month"
                          : `every ${subscription_interval} months`
                      }`
                  : null}
              </span>
            </p>
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
          <ItemTileSubtotal>
            <h4>{`A$${(quantity
              ? quantity * active_price
              : active_price
            ).toFixed(2)}`}</h4>
            <p>Subtotal</p>
          </ItemTileSubtotal>
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
                      value={submitCoupon.name}
                      placeholder="Enter Coupon Code"
                      onChange={(e) =>
                        updateSubmitCoupon({
                          ...submitCoupon,
                          name: e.target.value.toUpperCase(),
                        })
                      }
                    />
                    <Button onClick={() => applyCoupon(submitCoupon)}>
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
                  <ItemSubtotal>
                    <TotalLabel>Subtotal:</TotalLabel>
                    <h3>A${cartSubtotal.toFixed(2)}</h3>
                  </ItemSubtotal>
                  {coupon.coupon_type ? (
                    <ItemSubtotal>
                      <TotalLabel>{`Discount [${coupon.description}]:`}</TotalLabel>
                      <h3>{`-A$${discountAmount.toFixed(2)}`}</h3>
                    </ItemSubtotal>
                  ) : null}
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
