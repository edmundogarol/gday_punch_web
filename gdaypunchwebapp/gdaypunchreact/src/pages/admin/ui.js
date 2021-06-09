import React from "react";
import { NavLink, useParams } from "react-router-dom";
import Twitter from "./twitter";
import Prompts from "./prompts";
import Products from "./products";

import { AdminNav, AdminContentContainer } from "./styles";

function Ui() {
  const { app } = useParams();
  const twitter = app === "twitter";
  const prompts = app === "prompts";
  const products = app === "products";

  return (
    <div className="admin">
      <AdminNav>
        <NavLink exact to="/">
          Home
        </NavLink>
        <NavLink to="/admin/twitter">Twitter</NavLink>
        <NavLink to="/admin/instagram">Instagram</NavLink>
        <NavLink to="/admin/prompts">Prompts</NavLink>
        <NavLink to="/admin/products">Products</NavLink>
      </AdminNav>
      <AdminContentContainer>
        {twitter && <Twitter />}
        {prompts && <Prompts />}
        {products && <Products />}
      </AdminContentContainer>
    </div>
  );
}

export default Ui;
