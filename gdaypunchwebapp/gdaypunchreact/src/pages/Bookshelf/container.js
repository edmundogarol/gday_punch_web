import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import Ui from "./ui";

import { openRegistration, doSuggestRegister } from "actions/user";
import { doLikeManga } from "actions/manga";
import { fetchProducts as fetchProductsAction } from "actions/app";
import {
  selectLoggedIn,
  selectProductsState,
  selectPurchasedDigitalProducts,
  selectSavedProducts,
} from "selectors/app";

const mapState = createStructuredSelector({
  loggedIn: selectLoggedIn,
  products: selectProductsState,
  purchasedProducts: selectPurchasedDigitalProducts,
  savedProducts: selectSavedProducts,
});

const mapDispatch = {
  openRegister: openRegistration,
  suggestRegister: doSuggestRegister,
  likeManga: doLikeManga,
  fetchProducts: fetchProductsAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
