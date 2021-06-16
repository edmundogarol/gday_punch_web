import React from "react";
import { NavLink, useParams } from "react-router-dom";
import Twitter from "./twitter";
import Prompts from "./prompts";
import Products from "./products";
import StripeProducts from "./products/stripeProducts";
import ProductDetail from "./products/productDetails";

import { AdminNav, AdminContentContainer } from "./styles";

function Ui(props) {
  const { user } = props;
  const { app } = useParams();
  const twitter = app === "twitter";
  const prompts = app === "prompts";
  const products = app === "products";
  const stripeProducts = app === "stripe-products";
  const productDetail = app === "product-detail";

  function hasPrivilege(privilege) {
    if (!user) return true;

    const superUser = user.privileges.includes("super");
    if (superUser) return true;

    return user.privileges.includes(privilege);
  }

  return (
    <div className="admin">
      <AdminNav>
        <NavLink exact to="/">
          Home
        </NavLink>
        {hasPrivilege("twitter") && (
          <NavLink to="/admin/twitter">Twitter</NavLink>
        )}
        {hasPrivilege("instagram") && (
          <NavLink to="/admin/instagram">Instagram</NavLink>
        )}
        {hasPrivilege("admin") && (
          <NavLink to="/admin/prompts">Prompts</NavLink>
        )}
        {hasPrivilege("admin") && (
          <NavLink to="/admin/products">Products</NavLink>
        )}
      </AdminNav>
      <AdminContentContainer>
        {twitter && <Twitter />}
        {prompts && <Prompts />}
        {products && <Products />}
        {stripeProducts && <StripeProducts />}
        {productDetail && <ProductDetail />}
      </AdminContentContainer>
    </div>
  );
}

export default Ui;
