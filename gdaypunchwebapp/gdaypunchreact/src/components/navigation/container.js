import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { doLogout, openRegistration, closeRegistration } from "actions/user";
import { toggleSideCart as toggleSideCartAction } from "actions/cart";

import {
  selectUser,
  selectLoginViewToggle,
  selectLoggedIn,
  selectCartCount,
  selectLoginCheckFinished,
} from "selectors/app";
import Ui from "./ui";

const mapState = createStructuredSelector({
  user: selectUser,
  loggedIn: selectLoggedIn,
  loginView: selectLoginViewToggle,
  cartCount: selectCartCount,
  loginCheckFinished: selectLoginCheckFinished,
});

const mapDispatch = {
  logout: doLogout,
  openRegister: openRegistration,
  closeRegister: closeRegistration,
  toggleSideCart: toggleSideCartAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
