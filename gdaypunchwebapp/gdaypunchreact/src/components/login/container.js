import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  doLogin,
  doLogout,
  doRegistration,
  openRegistration,
  closeRegistration,
  clearLoginError as clearLoginErrorAction,
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
  clearLoginError: clearLoginErrorAction,
};

export default connect(mapState, mapDispatch)(Ui);
