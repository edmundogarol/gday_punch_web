import React from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  HomeOutlined,
  ShopOutlined,
  ShareAltOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import Twitter from "./twitter";
import Prompts from "./prompts";
import Products from "./products";
import Contacts from "./contacts";
import StripeProducts from "./products/stripeProducts";
import ProductDetail from "./products/productDetails";

import { AdminContainer, AdminNav, AdminContentContainer } from "./styles";

function Ui(props) {
  const { user } = props;
  const { app } = useParams();
  const dashboard = app === "";
  const store = app === "store";
  const socials = app === "socials";
  const twitter = app === "twitter";
  const prompts = app === "prompts";
  const orders = app === "orders";
  const products = app === "products";
  const contacts = app === "contacts";
  const stripeProducts = app === "stripe-products";
  const productDetail = app === "product-detail";

  function hasPrivilege(privilege) {
    if (!user) return true;

    const superUser = user.privileges.includes("super");
    if (superUser) return true;

    return user.privileges.includes(privilege);
  }

  return (
    <AdminContainer className="admin">
      <AdminNav>
        <NavLink className="desktop-mobile" exact to="/admin/">
          <HomeOutlined className="site-form-item-icon mobile-only" />
          Dashboard
        </NavLink>
        {hasPrivilege("admin") && (
          <NavLink className="mobile-only" to="/admin/store">
            <ShopOutlined className="site-form-item-icon" />
            Store
          </NavLink>
        )}
        {hasPrivilege("admin") && (
          <NavLink className="mobile-only" to="/admin/socials">
            <ShareAltOutlined className="site-form-item-icon" />
            Socials
          </NavLink>
        )}
        {hasPrivilege("twitter") && (
          <NavLink className="desktop-only" to="/admin/twitter">
            Twitter
          </NavLink>
        )}
        {hasPrivilege("instagram") && (
          <NavLink className="desktop-only" to="/admin/instagram">
            Instagram
          </NavLink>
        )}
        {hasPrivilege("admin") && (
          <NavLink className="desktop-only" to="/admin/contacts">
            Contacts
          </NavLink>
        )}
        {hasPrivilege("admin") && (
          <NavLink className="desktop-only" to="/admin/prompts">
            Prompts
          </NavLink>
        )}
        {hasPrivilege("admin") && (
          <NavLink className="desktop-only" to="/admin/orders">
            Orders
          </NavLink>
        )}
        {hasPrivilege("admin") && (
          <NavLink className="desktop-only" to="/admin/products">
            Products
          </NavLink>
        )}
      </AdminNav>
      <AdminContentContainer>
        {twitter && <Twitter />}
        {prompts && <Prompts />}
        {products && <Products />}
        {contacts && <Contacts />}
        {stripeProducts && <StripeProducts />}
        {productDetail && <ProductDetail />}
      </AdminContentContainer>
    </AdminContainer>
  );
}

export default Ui;
