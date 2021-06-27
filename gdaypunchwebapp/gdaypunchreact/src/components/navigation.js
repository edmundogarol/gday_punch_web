import React from "react";
import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import styled from "styled-components";

import { doLogout, openRegistration, closeRegistration } from "actions/user";
import {
  selectUser,
  selectLoginViewToggle,
  selectLoggedIn,
} from "selectors/app";
import { getImageModule } from "utils/utils";
import { device } from "utils/styles";

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { user, loggedIn, loginView, closeRegister, openRegister, logout } =
      this.props;

    window.onscroll = () => scrollFunction();

    function scrollFunction() {
      if (
        document.body.scrollTop > 50 ||
        document.documentElement.scrollTop > 50
      ) {
        document.getElementById("nav-container").style.fontSize = "11px";
        document.getElementById("nav-container").style.minHeight = "8vh";
      } else {
        document.getElementById("nav-container").style.fontSize = "15px";
        document.getElementById("nav-container").style.minHeight = "10vh";
      }
    }

    return (
      <NavigationContainer id="nav-container">
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
              {user.username && user.username.length
                ? user.username
                : user.email}
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
        </NavSection>
      </NavigationContainer>
    );
  }
}

export const NavigationContainer = styled.div`
  background-color: #ffffff;
  min-height: 10vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(5px + 1.5vmin);
  position: fixed;
  width: 100%;
  z-index: 10;
  transition: 0.2s;
`;

export const NavSection = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;

  p {
    margin: unset;
  }
`;

export const NavLogo = styled.img`
  width: 6em;
`;

export const NavLogoContainer = styled.div`
  margin-left: 1em;
`;

export const NavLinksMiddle = styled.div`
  margin-right: 1em;
  width: 129%;
  display: none;
  justify-content: center;
  align-items: center;

  @media ${device.laptop} {
    display: flex;
  }
`;

export const NavLinksRight = styled.div`
  margin-right: 1em;
  width: 50%;
  display: none;
  justify-content: flex-end;
  align-items: center;

  @media ${device.laptop} {
    display: flex;
  }
`;

export const UserProfile = styled.p`
  color: #cecece;
`;

export const HeaderALink = styled.a`
  text-decoration: none;
  color: #565656;
  font-size: 1em;
  letter-spacing: 2pt;
  margin-left: 2em;
`;

export const HeaderLink = styled(Link)`
  text-decoration: none;
  color: #565656;
  font-size: 1em;
  letter-spacing: 2pt;
  margin-left: 2em;
`;

const mapStateToProps = createStructuredSelector({
  user: selectUser,
  loggedIn: selectLoggedIn,
  loginView: selectLoginViewToggle,
});

const mapDispatchToProps = {
  logout: doLogout,
  openRegister: openRegistration,
  closeRegister: closeRegistration,
};

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
