import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { MenuOutlined, ShoppingCartOutlined } from "@ant-design/icons";

import { getResourceImage, scrollToTop } from "utils/utils";
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

const initialParentNavsState = {
  resources: false,
  submissions: false,
};

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
  const [parentNavs, updateParentNavs] = useState(initialParentNavsState);

  window.onscroll = () => scrollFunction();

  const toggleParentNav = (parent) => {
    updateParentNavs({
      ...initialParentNavsState,
      [parent]: !parentNavs[parent],
    });
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

  useEffect(() => {
    if (location === "/downloads" || location === "/daily-prompt") {
      updateParentNavs({ ...initialParentNavsState, resources: true });
    }
    if (
      location === "/one-shots" ||
      location === "/illustrations" ||
      location === "/vote"
    ) {
      updateParentNavs({ ...initialParentNavsState, submissions: true });
    }
  }, [location]);

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
              src={getResourceImage("gday_header.png")}
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
              updateParentNavs(initialParentNavsState);
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
            onClick={() => {
              toggleMiniNav(false);
              updateParentNavs(initialParentNavsState);
            }}
          >
            {"Home"}
          </HeaderLink>
          <HeaderLink
            to="/shop"
            $current={location === "/shop"}
            onClick={() => {
              toggleMiniNav(false);
              updateParentNavs(initialParentNavsState);
            }}
          >
            {"Shop"}
          </HeaderLink>
          <HeaderParent
            $open={parentNavs.submissions}
            $current={
              location === "/one-shots" ||
              location === "/illustrations" ||
              location === "/vote"
            }
            onClick={() => toggleParentNav("submissions")}
            $firstChildMobXOffset={"-6.5em"}
            $secondChildMobXOffset={"2em"}
            $thirdChildMobXOffset={"9em"}
            $firstChildXOffset={"-8em"}
            $secondChildXOffset={"-0em"}
            $thirdChildXOffset={"9em"}
          >
            {"Submit +"}
            <HeaderLink
              className="child-nav first-child"
              to="/one-shots"
              $current={location === "/one-shots"}
              onClick={() => {
                toggleMiniNav(false);
                updateParentNavs(initialParentNavsState);
              }}
            >
              {"One Shots"}
            </HeaderLink>
            <HeaderLink
              className="child-nav second-child"
              to="/illustrations"
              $current={location === "/illustrations"}
              onClick={() => {
                toggleMiniNav(false);
                updateParentNavs(initialParentNavsState);
              }}
            >
              {"Illustrations"}
            </HeaderLink>
            <HeaderLink
              className="child-nav third-child"
              to="/vote"
              $current={location === "/vote"}
              onClick={() => {
                toggleMiniNav(false);
                updateParentNavs(initialParentNavsState);
              }}
            >
              {"Vote"}
            </HeaderLink>
          </HeaderParent>
          <HeaderLink
            to="/about"
            $current={location === "/about"}
            onClick={() => {
              toggleMiniNav(false);
              updateParentNavs(initialParentNavsState);
            }}
          >
            {"About"}
          </HeaderLink>
          <HeaderParent
            $open={parentNavs.resources}
            $current={location === "/downloads" || location === "/daily-prompt"}
            onClick={() => toggleParentNav("resources")}
            $firstChildMobXOffset={"-4em"}
            $secondChildMobXOffset={"5em"}
            $firstChildXOffset={"-5.5em"}
            $secondChildXOffset={"4.5em"}
          >
            {"Resources +"}
            <HeaderLink
              className="child-nav first-child"
              to="/daily-prompt"
              $current={location === "/daily-prompt"}
              onClick={() => {
                toggleMiniNav(false);
                updateParentNavs(initialParentNavsState);
              }}
            >
              {"Daily Prompt"}
            </HeaderLink>
            <HeaderLink
              className="child-nav second-child"
              to="/downloads"
              $current={location === "/downloads"}
              onClick={() => {
                toggleMiniNav(false);
                updateParentNavs(initialParentNavsState);
              }}
            >
              {"Downloads"}
            </HeaderLink>
          </HeaderParent>
          <HeaderLink
            to="/contact"
            $current={location === "/contact"}
            onClick={() => {
              toggleMiniNav(false);
              updateParentNavs(initialParentNavsState);
            }}
          >
            {"Contact"}
          </HeaderLink>
          {loggedIn && (
            <HeaderLink
              to="/bookshelf"
              $adminLink
              $current={location === "/bookshelf"}
              onClick={() => {
                toggleMiniNav(false);
                updateParentNavs(initialParentNavsState);
              }}
            >
              {"Bookshelf"}
            </HeaderLink>
          )}
          {loggedIn && (
            <HeaderLink
              to="/account"
              $adminLink
              $current={location === "/account"}
              onClick={() => {
                toggleMiniNav(false);
                updateParentNavs(initialParentNavsState);
              }}
            >
              {"Account"}
            </HeaderLink>
          )}
          {loginCheckFinished && user.is_staff && (
            <HeaderLink
              to="/admin"
              $adminLink
              $current={location === "/admin"}
              onClick={() => {
                toggleMiniNav(false);
                updateParentNavs(initialParentNavsState);
              }}
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
                updateParentNavs(initialParentNavsState);
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
                updateParentNavs(initialParentNavsState);
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
            <HeaderLink
              to="/bookshelf"
              $current={location === "/bookshelf"}
              onClick={() => updateParentNavs(initialParentNavsState)}
            >
              {"Bookshelf"}
            </HeaderLink>
          )}
          {loggedIn && (
            <HeaderLink
              to="/account"
              $current={location === "/account"}
              onClick={() => updateParentNavs(initialParentNavsState)}
            >
              {"Account"}
            </HeaderLink>
          )}
          {loginCheckFinished && user.is_staff && (
            <HeaderLink
              to="/admin"
              $current={location === "/admin"}
              onClick={() => updateParentNavs(initialParentNavsState)}
            >
              {"Admin"}
            </HeaderLink>
          )}
          {!loggedIn && (
            <HeaderALink
              href="#top"
              onClick={() => {
                updateParentNavs(initialParentNavsState);
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
            <HeaderALink
              href="#"
              onClick={() => {
                logout();
                updateParentNavs(initialParentNavsState);
              }}
            >
              Logout
            </HeaderALink>
          )}
          <HeaderLink
            to="#"
            $current={location === "/cart"}
            onClick={() => {
              toggleSideCart(true);
              updateParentNavs(initialParentNavsState);
            }}
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
