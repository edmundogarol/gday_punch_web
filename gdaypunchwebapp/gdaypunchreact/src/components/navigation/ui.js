import React, { useState } from "react";
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
  const {
    user,
    loggedIn,
    loginView,
    closeRegister,
    openRegister,
    logout,
    history,
  } = props;
  const [miniNavOpen, toggleMiniNav] = useState(false);
  const [scrolledMini, toggleScrolledMini] = useState(false);

  window.onscroll = () => scrollFunction();

  const scrollFunction = () => {
    if (
      document.body.scrollTop > 50 ||
      document.documentElement.scrollTop > 50
    ) {
      document.getElementById("navbar").style.minHeight = "8vh";
      document.getElementById("navbar").style.fontSize = "14px";
      toggleScrolledMini(true);
    } else {
      document.getElementById("navbar").style.minHeight = "11.5vh";
      document.getElementById("navbar").style.fontSize = "15px";
      toggleScrolledMini(false);
    }
  };

  const handleOpenRegister = () => {
    if (window.location.pathname !== "/") {
      history.push("/");
    }
    openRegister();
  };

  const handleCloseRegister = () => {
    history.push("/");
    closeRegister();
  };

  const location = window.location.pathname;

  console.log({ miniNavOpen });
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
        <NavLinksMiddle $open={miniNavOpen} $scrolledMini={scrolledMini}>
          <HeaderLink
            to="/"
            $current={location === "/"}
            onClick={() => toggleMiniNav(false)}
          >
            {"Home"}
          </HeaderLink>
          <HeaderLink
            to="/shop"
            $current={location === "/shop"}
            onClick={() => toggleMiniNav(false)}
          >
            {"Shop"}
          </HeaderLink>
          <HeaderLink
            to="/about"
            $current={location === "/about"}
            onClick={() => toggleMiniNav(false)}
          >
            {"About"}
          </HeaderLink>
          <HeaderLink
            to="/contact"
            $current={location === "/contact"}
            onClick={() => toggleMiniNav(false)}
          >
            {"Contact"}
          </HeaderLink>
          {user.is_staff && (
            <HeaderLink
              to="/admin"
              $adminLink
              $current={location === "/admin"}
              onClick={() => toggleMiniNav(false)}
            >
              {"Admin"}
            </HeaderLink>
          )}
          {!loggedIn && (
            <HeaderALink
              href="#"
              $adminLink
              onClick={() => {
                toggleMiniNav(false);
                return loginView ? handleCloseRegister() : handleOpenRegister();
              }}
            >
              {loginView ? "Home" : "Login"}
            </HeaderALink>
          )}
          {loggedIn && (
            <HeaderALink
              $adminLink
              href="#"
              onClick={() => {
                toggleMiniNav(false);
                return logout();
              }}
            >
              Logout
            </HeaderALink>
          )}
        </NavLinksMiddle>
        <NavLinksRight>
          {/* <UserProfile>
            {user.username && user.username.length ? user.username : user.email}
          </UserProfile> */}
          {user.is_staff && (
            <HeaderLink to="/admin" $current={location === "/admin"}>
              {"Admin"}
            </HeaderLink>
          )}
          {!loggedIn && (
            <HeaderALink
              href="#"
              onClick={() =>
                loginView ? handleCloseRegister() : handleOpenRegister()
              }
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
        <NavDropDownButton onClick={() => toggleMiniNav(!miniNavOpen)}>
          <MenuOutlined className="site-form-item-icon" />
        </NavDropDownButton>
      </NavSection>
    </NavigationContainer>
  );
}

export default Ui;
