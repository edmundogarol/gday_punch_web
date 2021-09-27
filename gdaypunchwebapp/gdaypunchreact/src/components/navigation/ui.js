import React, { useState } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { MenuOutlined, ShoppingCartOutlined } from "@ant-design/icons";

import { getImageModule, scrollToTop } from "utils/utils";
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
  HeaderParent,
  CartNumber,
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
    cartCount,
    toggleSideCart,
    loginCheckFinished,
  } = props;
  const [miniNavOpen, toggleMiniNav] = useState(false);
  const [scrolledMini, toggleScrolledMini] = useState(false);
  const [parentNavs, updateParentNavs] = useState({
    resources: false,
  });

  window.onscroll = () => scrollFunction();

  const toggleParentNav = (parent) => {
    updateParentNavs({ ...parentNavs, [parent]: !parentNavs[parent] });
  };

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

  return (
    <NavigationContainer
      id="navbar"
      $childNavOpen={
        Object.values(parentNavs).filter((parent) => parent).length
      }
    >
      <NavSection>
        <NavLogoContainer>
          <NavLink to="/">
            <NavLogo
              src={getImageModule("gday_header.png")}
              alt="Gday Punch Logo"
            />
          </NavLink>
        </NavLogoContainer>
        {!location.includes("cart") && (
          <HeaderLink
            to="#"
            $showOnMiniNav
            $adminLink
            $current={location === "/cart"}
            onClick={() => {
              toggleMiniNav(false);
              toggleSideCart(true);
            }}
          >
            <ShoppingCartOutlined className="site-form-item-icon" />
            {cartCount > 0 && (
              <CartNumber $showOnMiniNav>{cartCount}</CartNumber>
            )}
          </HeaderLink>
        )}
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
          <HeaderParent
            $open={parentNavs.resources}
            onClick={() => toggleParentNav("resources")}
          >
            {"Resources +"}
            <HeaderLink
              className="child-nav first-child"
              to="/daily-prompt"
              $current={location === "/daily-prompt"}
              onClick={() => toggleMiniNav(false)}
            >
              {"Daily Prompt"}
            </HeaderLink>
            <HeaderLink
              className="child-nav second-child"
              to="/downloads"
              $current={location === "/downloads"}
              onClick={() => toggleMiniNav(false)}
            >
              {"Downloads"}
            </HeaderLink>
          </HeaderParent>
          <HeaderLink
            to="/contact"
            $current={location === "/contact"}
            onClick={() => toggleMiniNav(false)}
          >
            {"Contact"}
          </HeaderLink>
          {loggedIn && (
            <HeaderLink
              to="/account"
              $adminLink
              $current={location === "/account"}
              onClick={() => toggleMiniNav(false)}
            >
              {"Account"}
            </HeaderLink>
          )}
          {loggedIn && (
            <HeaderLink
              to="/bookshelf"
              $adminLink
              $current={location === "/bookshelf"}
              onClick={() => toggleMiniNav(false)}
            >
              {"Bookshelf"}
            </HeaderLink>
          )}
          {loginCheckFinished && user.is_staff && (
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
          {loggedIn && (
            <HeaderLink to="/account" $current={location === "/account"}>
              {"Account"}
            </HeaderLink>
          )}
          {loggedIn && (
            <HeaderLink to="/bookshelf" $current={location === "/bookshelf"}>
              {"Bookshelf"}
            </HeaderLink>
          )}
          {loginCheckFinished && user.is_staff && (
            <HeaderLink to="/admin" $current={location === "/admin"}>
              {"Admin"}
            </HeaderLink>
          )}
          {!loggedIn && (
            <HeaderALink
              href="#top"
              onClick={() => {
                if (loginView) {
                  handleCloseRegister();
                } else {
                  scrollToTop();
                  handleOpenRegister();
                }
              }}
            >
              {loginView ? "Home" : "Login"}
            </HeaderALink>
          )}
          {loggedIn && (
            <HeaderALink href="#" onClick={() => logout()}>
              Logout
            </HeaderALink>
          )}
          <HeaderLink
            to="#"
            $current={location === "/cart"}
            onClick={() => toggleSideCart(true)}
          >
            {"Cart"}
            <ShoppingCartOutlined className="site-form-item-icon" />
            {cartCount > 0 && <CartNumber>{cartCount}</CartNumber>}
          </HeaderLink>
        </NavLinksRight>
        <NavDropDownButton onClick={() => toggleMiniNav(!miniNavOpen)}>
          <MenuOutlined className="site-form-item-icon" />
        </NavDropDownButton>
      </NavSection>
    </NavigationContainer>
  );
}

export default Ui;
