import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import Ui from "./ui";

import { openRegistration, doSuggestRegister } from "actions/user";
import { doGetFeaturedManga, doLikeManga } from "actions/manga";
import { selectLoginViewToggle, selectLoggedIn } from "selectors/app";
import { selectFeaturedManga } from "selectors/manga";

const mapState = createStructuredSelector({
  loggedIn: selectLoggedIn,
  loginView: selectLoginViewToggle,
  featuredManga: selectFeaturedManga,
});

const mapDispatch = {
  openRegister: openRegistration,
  suggestRegister: doSuggestRegister,
  getFeaturedManga: doGetFeaturedManga,
  likeManga: doLikeManga,
};

export default connect(mapState, mapDispatch)(Ui);
