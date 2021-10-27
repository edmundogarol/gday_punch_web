import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import Ui from "./ui";

import { openRegistration, doSuggestRegister } from "actions/user";
import { doLikeManga } from "actions/manga";
import { fetchProducts as fetchProductsAction } from "actions/app";
import {
  selectLoggedIn,
  selectBuyableProducts,
  selectLatestFreeProducts,
  selectProductsState,
} from "selectors/app";

const mapState = createStructuredSelector({
  loggedIn: selectLoggedIn,
  products: selectProductsState,
  buyableProducts: selectBuyableProducts,
  freeProducts: selectLatestFreeProducts,
});

const mapDispatch = {
  openRegister: openRegistration,
  suggestRegister: doSuggestRegister,
  likeManga: doLikeManga,
  fetchProducts: fetchProductsAction,
};

export default connect(mapState, mapDispatch)(Ui);
