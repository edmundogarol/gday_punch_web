import React from "react";
import { NavLink } from "react-router-dom";
import {
  OrderSummaryContainer,
  OrderSummaryFixed,
  SideCartItemsList,
  ItemTotalContainer,
  ItemSummarySubtotal,
  TotalLabel,
  ItemTotal,
  GSTLabel,
  CartFooter,
} from "../styles";
import CartItem from "../cartItem";

function Ui(props) {
  const {
    items,
    handleViewProduct,
    cartSubtotal,
    coupon,
    discountAmount,
    cartTotal,
    className,
    freeShipping,
    allDigitalCart,
  } = props;

  const renderShipping = () => {
    if (allDigitalCart) return null;

    if (freeShipping) {
      return (
        <ItemSummarySubtotal>
          <TotalLabel>Free Australian Standard Shipping:</TotalLabel>
          <h3>A$0.00</h3>
        </ItemSummarySubtotal>
      );
    } else {
      return (
        <ItemSummarySubtotal>
          <TotalLabel>International Standard Shipping:</TotalLabel>
          <h3>A$13.00</h3>
        </ItemSummarySubtotal>
      );
    }
  };
  return (
    <OrderSummaryContainer className={className}>
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
            <ItemSummarySubtotal>
              <TotalLabel>Subtotal:</TotalLabel>
              <h3>A${cartSubtotal.toFixed(2)}</h3>
            </ItemSummarySubtotal>
            {renderShipping()}
            {coupon.coupon_type ? (
              <ItemSummarySubtotal>
                <TotalLabel>
                  Discount:
                  <span>{` [${coupon.description}]`}</span>
                </TotalLabel>
                <h3>{`-A$${discountAmount.toFixed(2)}`}</h3>
              </ItemSummarySubtotal>
            ) : null}
            <ItemTotal>
              <TotalLabel>Total:</TotalLabel>
              <h3>
                A$
                {(allDigitalCart
                  ? cartTotal
                  : freeShipping
                  ? cartTotal
                  : cartTotal + 13
                ).toFixed(2)}
              </h3>
            </ItemTotal>
            <GSTLabel>[Price Includes GST]</GSTLabel>
          </div>
        </ItemTotalContainer>
        <CartFooter></CartFooter>
      </OrderSummaryFixed>
    </OrderSummaryContainer>
  );
}

export default Ui;
