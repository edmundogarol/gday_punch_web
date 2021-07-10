import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import Ui from "./ui";

import { openRegistration, doSuggestRegister } from "actions/user";
import { doGetFeaturedManga, doLikeManga } from "actions/manga";
import { fetchAdminProducts as fetchAdminProductsAction } from "actions/home";
import { selectLoggedIn } from "selectors/app";
import { selectFeaturedManga } from "selectors/manga";
import { selectHomeProductsState } from "selectors/home";

const mapState = createStructuredSelector({
  loggedIn: selectLoggedIn,
  featuredManga: selectFeaturedManga,
  products: selectHomeProductsState,
});

const mapDispatch = {
  openRegister: openRegistration,
  suggestRegister: doSuggestRegister,
  getFeaturedManga: doGetFeaturedManga,
  likeManga: doLikeManga,
  fetchAdminProducts: fetchAdminProductsAction,
};

export default connect(mapState, mapDispatch)(Ui);
