import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import Ui from "./ui";

import { selectLoggedIn, selectVotingState } from "selectors/app";
import {
  castVote as castVoteAction,
  fetchVotingItems as fetchVotingItemsAction,
} from "src/actions/voting";

const mapState = createStructuredSelector({
  loggedIn: selectLoggedIn,
  votingState: selectVotingState,
});

const mapDispatch = {
  fetchVotingItems: fetchVotingItemsAction,
  castVote: castVoteAction,
};

export default connect(mapState, mapDispatch)(Ui);
