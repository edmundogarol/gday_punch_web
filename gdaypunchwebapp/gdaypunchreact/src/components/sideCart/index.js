import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingCartOutlined,
  VerticalAlignTopOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Typography, Select, Tooltip, Button } from "antd";

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
  ItemTotal,
  TotalLabel,
  GSTLabel,
  ItemTotalContainer,
  SideCartCheckoutButton,
  SideCartFooterContainer,
} from "./styles";

import { generatePermaLink, getGdayPunchStaticUrl } from "utils/utils";
import {
  selectCartCount,
  selectCartState,
  selectCartTotal,
  selectDiscountAmount,
  selectProductList,
} from "selectors/app";
import { selectPaymentState } from "selectors/payment";
import {
  removeCartItem,
  toggleSideCart,
  updateCartItemQuantity,
} from "actions/cart";
import { setViewingProduct } from "actions/products";

const { Title } = Typography;
const { Option } = Select;

function SideCart({ history }) {
  const { sideCartOpen } = useSelector(selectCartState);
  const { coupon } = useSelector(selectPaymentState);
  const discountAmount = useSelector(selectDiscountAmount);
  const cartCount = useSelector(selectCartCount);
  const cartTotal = useSelector(selectCartTotal);
  const cartItemsObject = useSelector(selectProductList);

  const dispatch = useDispatch();

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
    dispatch(setViewingProduct(product.id));
    dispatch(toggleSideCart(false));
    const perma_link = generatePermaLink(product);
    history.push(`/product/${product.id}/${perma_link}`);
  };

  const cartItem = (item) => {
    const {
      id,
      image,
      title,
      product_type,
      active_price,
      quantity,
      stock,
      subscription_interval,
    } = item;
    const digitalProduct = product_type !== "physical";
    const qtyRange = digitalProduct && quantity ? 1 : stock > 10 ? 10 : stock;

    return (
      <ItemContainer key={id}>
        <ItemImage src={getGdayPunchStaticUrl(image)} />
        <ItemTitleMetaContainer>
          <a onClick={() => handleViewProduct(item)}>
            <h3>{title}</h3>
          </a>
          <ItemMeta>
            <p>
              {`A$${active_price.toFixed(2)}`}
              <span className="interval">
                {product_type.includes("subscription")
                  ? product_type === "mag_subscription"
                    ? "per release"
                    : `per ${
                        subscription_interval < 2
                          ? "mon"
                          : `${subscription_interval}mon`
                      }`
                  : null}
              </span>
            </p>
            <p className="spacer">QTY:</p>
            <Select
              value={quantity}
              onSelect={(value) => dispatch(updateCartItemQuantity(id, value))}
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
            <Button onClick={() => dispatch(removeCartItem(id))}>
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
        onClick={() => dispatch(toggleSideCart(false))}
      />
      <SideCartContainer
        className={`side-cart ${sideCartOpen ? "side-cart-open" : ""}`}
      >
        <SideCartHeader>
          <CloseSideCart onClick={() => dispatch(toggleSideCart(false))}>
            <VerticalAlignTopOutlined className="site-form-item-icon" />
          </CloseSideCart>
          <Title level={4}>
            Cart
            <ShoppingCartOutlined className="site-form-item-icon" />
          </Title>
          <p>{cartCount}</p>
          <NavLink to="/cart" onClick={() => dispatch(toggleSideCart(false))}>
            Edit Cart
          </NavLink>
        </SideCartHeader>
        <SideCartItemsList>
          {items.map((item) => cartItem(item))}
        </SideCartItemsList>
        <SideCartFooterContainer>
          <ItemTotalContainer>
            <NavLink target="_blank" to="/refunds-and-returns">
              <p className="website">Refunds & Returns Policy</p>
            </NavLink>
            <div>
              <ItemTotal>
                <TotalLabel>Total:</TotalLabel>
                <h3>A${cartTotal.toFixed(2)}</h3>
              </ItemTotal>
              <GSTLabel>
                <span>
                  {coupon.name
                    ? `Coupon: ${coupon.name} -A$${
                        discountAmount ? discountAmount.toFixed(2) : 0
                      } `
                    : ""}
                </span>
                [Price Includes GST]
              </GSTLabel>
            </div>
          </ItemTotalContainer>
          <SideCartCheckoutButton
            onClick={() => {
              history.push("/cart");
              dispatch(toggleSideCart(false));
            }}
          >
            Review Cart
          </SideCartCheckoutButton>
        </SideCartFooterContainer>
      </SideCartContainer>
    </>
  );
}

export default withRouter(SideCart);
