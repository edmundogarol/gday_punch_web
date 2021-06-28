import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  doLogin,
  doLogout,
  doRegistration,
  openRegistration,
  closeRegistration,
} from "actions/user";
import {
  selectLoginViewToggle,
  selectLoginError,
  selectRegistrationError,
  selectSuggestRegistration,
  selectLoggedIn,
} from "selectors/app";
import Ui from "./ui";

const mapState = createStructuredSelector({
  loggedIn: selectLoggedIn,
  loginView: selectLoginViewToggle,
  loginError: selectLoginError,
  registrationError: selectRegistrationError,
  suggestRegistration: selectSuggestRegistration,
});

const mapDispatch = {
  login: doLogin,
  logout: doLogout,
  register: doRegistration,
  openRegister: openRegistration,
  closeRegister: closeRegistration,
};

export default connect(mapState, mapDispatch)(Ui);
