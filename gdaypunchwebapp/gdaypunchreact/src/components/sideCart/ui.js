import React, { useState } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { ShoppingCartOutlined } from "@ant-design/icons";

import { Typography } from "antd";
import { SideCartContainer, SideCartPopOut } from "./styles";

const { Title } = Typography;

function Ui(props) {
  const { cartState, toggleSideCart } = props;
  const { items, cartCount, sideCartOpen } = cartState;

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

  return (
    <SideCartContainer
      onClick={() => toggleSideCart(false)}
      className={`side-cart ${sideCartOpen ? "side-cart-open" : ""}`}
    >
      <SideCartPopOut>
        <button onClick={() => toggleSideCart(false)}>Close</button>
        <Title level={4}>
          Shopping Cart
          <ShoppingCartOutlined className="site-form-item-icon" />
          {cartCount}
        </Title>
      </SideCartPopOut>
    </SideCartContainer>
  );
}

export default Ui;
