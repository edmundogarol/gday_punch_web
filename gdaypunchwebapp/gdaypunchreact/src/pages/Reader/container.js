import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import {
  doUpdateUserDetails,
  openRegistration,
  doSuggestRegister,
} from "actions/user";
import {
  doGetManga,
  doSetReadingManga,
  doCommentManga,
  doGetComments,
  doLikeComment,
  doLikeManga,
} from "actions/manga";
import { selectLoggedIn, selectUser } from "selectors/app";
import { selectReadingManga, selectComments } from "selectors/manga";

import Ui from "./ui";

const mapState = createStructuredSelector({
  user: selectUser,
  loggedIn: selectLoggedIn,
  manga: selectReadingManga,
  comments: selectComments,
});

const mapDispatch = {
  openRegister: openRegistration,
  suggestRegister: doSuggestRegister,
  setReadingManga: doSetReadingManga,
  getManga: doGetManga,
  updateUserDetails: doUpdateUserDetails,
  commentManga: doCommentManga,
  getComments: doGetComments,
  likeComment: doLikeComment,
  likeManga: doLikeManga,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
