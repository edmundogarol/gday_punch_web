import React from "react";
import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";

import { doLogout, openRegistration, closeRegistration } from "actions/user";
import {
  selectUser,
  selectLoginViewToggle,
  selectLoggedIn
} from "selectors/app";
import { getImageModule } from "utils/utils";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      user,
      loggedIn,
      loginView,
      closeRegister,
      openRegister,
      logout
    } = this.props;

    return (
      <div className="navigation-container">
        <nav>
          <div className="nav-logo">
            <NavLink className="logo-link" to="/">
              <img src={getImageModule("gday.png")} alt="Gday Punch Logo" />
            </NavLink>
          </div>
          <div className="nav-links">
            <p>{user.username && user.username.length ? user.username : user.email}</p>
            {user.is_staff && <Link to="/admin">{"Admin"}</Link>}
            {!loggedIn && (
              <a
                className="login-button"
                href="#"
                onClick={() => (loginView ? closeRegister() : openRegister())}
              >
                {loginView ? "Home" : "Login"}
              </a>
            )}
            {loggedIn && (
              <a href="#" onClick={() => logout()}>
                Logout
              </a>
            )}
          </div>
        </nav>
      </div>
    );
  }
}

Navigation.propTypes = {
  // Redux Properties
  user: PropTypes.object.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  loginView: PropTypes.bool.isRequired,

  // Redux Functions
  logout: PropTypes.func.isRequired,
  openRegister: PropTypes.func.isRequired,
  closeRegister: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  user: selectUser,
  loggedIn: selectLoggedIn,
  loginView: selectLoginViewToggle
});

const mapDispatchToProps = {
  logout: doLogout,
  openRegister: openRegistration,
  closeRegister: closeRegistration
};

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
