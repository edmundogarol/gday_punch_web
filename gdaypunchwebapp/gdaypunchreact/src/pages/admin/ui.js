import React, { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  HomeOutlined,
  ShopOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";

import RoutingPage from "./routingPage";
import Users from "./users";
import Twitter from "./twitter";
import Prompts from "./prompts";
import Products from "./products";
import Votes from "./votes";
import Orders from "./orders";
import Contacts from "./contacts";
import Coupons from "./coupons";
import StripeProducts from "./products/stripeProducts";
import ProductDetail from "./products/productDetails";

import { AdminContainer, AdminNav, AdminContentContainer } from "./styles";
import { useScrollTop } from "utils/hooks/useScrollTop";

function Ui(props) {
  const { user, history, loginCheckFinished } = props;
  const { app } = useParams();

  const dashboard = app === undefined;
  const store = app === "store";
  const socials = app === "socials";
  const users = app === "users";
  const twitter = app === "twitter";
  const prompts = app === "prompts";
  const orders = app === "orders";
  const votes = app === "votes";
  const coupons = app === "coupons";
  const products = app === "products";
  const contacts = app === "contacts";
  const stripeProducts = app === "stripe-products";
  const productDetail = app === "product-detail";

  useScrollTop();

  function hasPrivilege(privilege) {
    if (!user.id) return false;

    const superUser = user.privileges.includes("super");
    if (superUser) return true;

    return user.privileges.includes(privilege);
  }

  useEffect(() => {
    if (loginCheckFinished && !hasPrivilege("admin") && dashboard) {
      history.push("/admin/socials");
    }
  }, [app]);

  return (
    <AdminContainer className="admin">
      <AdminNav id="admin-nav">
        {hasPrivilege("admin") && (
          <NavLink className="desktop-mobile" exact to="/admin/">
            <HomeOutlined className="site-form-item-icon mobile-only" />
            Dashboard
          </NavLink>
        )}
        {hasPrivilege("admin") && (
          <NavLink className="mobile-only" to="/admin/store">
            <ShopOutlined className="site-form-item-icon" />
            Store
          </NavLink>
        )}
        {(hasPrivilege("twitter") || hasPrivilege("instagram")) && (
          <NavLink className="mobile-only" to="/admin/socials">
            <ShareAltOutlined className="site-form-item-icon" />
            Socials
          </NavLink>
        )}
        {hasPrivilege("admin") && (
          <NavLink className="desktop-only" to="/admin/users">
            Users
          </NavLink>
        )}
        {hasPrivilege("admin") && (
          <NavLink className="desktop-only" to="/admin/votes">
            Votes
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
        {hasPrivilege("admin") && (
          <NavLink className="desktop-only" to="/admin/coupons">
            Coupons
          </NavLink>
        )}
      </AdminNav>
      <AdminContentContainer>
        {dashboard && <RoutingPage pageType="dashboard" />}
        {store && <RoutingPage pageType="store" />}
        {socials && <RoutingPage pageType="socials" />}
        {users && <Users />}
        {twitter && <Twitter />}
        {prompts && <Prompts />}
        {coupons && <Coupons />}
        {votes && <Votes />}
        {products && <Products />}
        {orders && <Orders />}
        {contacts && <Contacts />}
        {stripeProducts && <StripeProducts />}
        {productDetail && <ProductDetail />}
      </AdminContentContainer>
    </AdminContainer>
  );
}

export default Ui;
