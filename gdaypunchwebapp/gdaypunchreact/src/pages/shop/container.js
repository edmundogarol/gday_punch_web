import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import Ui from "./ui";

import { openRegistration, doSuggestRegister } from "actions/user";
import { doLikeManga } from "actions/manga";
import { fetchProducts as fetchProductsAction } from "actions/app";
import {
  selectLoggedIn,
  selectBuyableProducts,
  selectFreeProducts,
} from "selectors/app";

const mapState = createStructuredSelector({
  loggedIn: selectLoggedIn,
  buyableProducts: selectBuyableProducts,
  freeProducts: selectFreeProducts,
});

const mapDispatch = {
  openRegister: openRegistration,
  suggestRegister: doSuggestRegister,
  likeManga: doLikeManga,
  fetchProducts: fetchProductsAction,
};

export default connect(mapState, mapDispatch)(Ui);
