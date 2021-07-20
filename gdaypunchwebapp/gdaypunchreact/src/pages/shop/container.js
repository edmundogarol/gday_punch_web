import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import Ui from "./ui";

import { openRegistration, doSuggestRegister } from "actions/user";
import { doGetFeaturedManga, doLikeManga } from "actions/manga";
import { fetchProducts as fetchProductsAction } from "actions/app";
import { selectLoggedIn, selectProductsState } from "selectors/app";
import { selectFeaturedManga } from "selectors/manga";

const mapState = createStructuredSelector({
  loggedIn: selectLoggedIn,
  featuredManga: selectFeaturedManga,
  products: selectProductsState,
});

const mapDispatch = {
  openRegister: openRegistration,
  suggestRegister: doSuggestRegister,
  getFeaturedManga: doGetFeaturedManga,
  likeManga: doLikeManga,
  fetchProducts: fetchProductsAction,
};

export default connect(mapState, mapDispatch)(Ui);
