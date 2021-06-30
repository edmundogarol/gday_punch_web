import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { MenuOutlined } from "@ant-design/icons";

import { getImageModule } from "utils/utils";
import {
  NavigationContainer,
  NavSection,
  NavLogo,
  NavLogoContainer,
  NavLinksMiddle,
  NavDropDownButton,
  NavLinksRight,
  UserProfile,
  HeaderALink,
  HeaderLink,
} from "./styles";

function Ui(props) {
  const { user, loggedIn, loginView, closeRegister, openRegister, logout } =
    props;

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
    <NavigationContainer id="navbar">
      <NavSection>
        <NavLogoContainer>
          <NavLink to="/">
            <NavLogo
              src={getImageModule("gday_header.png")}
              alt="Gday Punch Logo"
            />
          </NavLink>
        </NavLogoContainer>
        <NavLinksMiddle>
          <HeaderLink to="/shop">{"Shop"}</HeaderLink>
          <HeaderLink to="/about">{"About"}</HeaderLink>
          <HeaderLink to="/contact">{"Contact"}</HeaderLink>
        </NavLinksMiddle>
        <NavLinksRight>
          <UserProfile>
            {user.username && user.username.length ? user.username : user.email}
          </UserProfile>
          {user.is_staff && <HeaderLink to="/admin">{"Admin"}</HeaderLink>}
          {!loggedIn && (
            <HeaderALink
              href="#"
              onClick={() => (loginView ? closeRegister() : openRegister())}
            >
              {loginView ? "Home" : "Login"}
            </HeaderALink>
          )}
          {loggedIn && (
            <HeaderALink href="#" onClick={() => logout()}>
              Logout
            </HeaderALink>
          )}
        </NavLinksRight>
        <NavDropDownButton>
          <MenuOutlined className="site-form-item-icon" />
        </NavDropDownButton>
      </NavSection>
    </NavigationContainer>
  );
}

export default Ui;
