import React from "react";
import { NavLink, useParams } from "react-router-dom";
import Twitter from "./twitter";
import Prompts from "./prompts";

import { AdminNav, AdminContentContainer } from "./styles";

function Ui() {
  const { app } = useParams();
  const twitter = app === "twitter";
  const prompts = app === "prompts";

  return (
    <div className="admin">
      <AdminNav>
        <NavLink exact to="/">
          Home
        </NavLink>
        <NavLink to="/admin/twitter">Twitter</NavLink>
        <NavLink to="/admin/instagram">Instagram</NavLink>
        <NavLink to="/admin/prompts">Prompts</NavLink>
      </AdminNav>
      <AdminContentContainer>
        {twitter && <Twitter />}
        {prompts && <Prompts />}
      </AdminContentContainer>
    </div>
  );
}

export default Ui;
