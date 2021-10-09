export const FETCH_VOTING_ITEMS = "voting/FETCH_VOTING_ITEMS";
export const FETCHING_VOTING_ITEMS = "voting/FETCHING_VOTING_ITEMS";
export const FINISHED_FETCHING_VOTING_ITEMS =
  "voting/FINISHED_FETCHING_VOTING_ITEMS";
export const UPDATE_VOTING_ITEMS = "voting/UPDATE_VOTING_ITEMS";
export const VOTING_ITEMS_ERROR = "voting/VOTING_ITEMS_ERROR";

export const CAST_VOTE = "voting/CAST_VOTE";
export const CASTING_VOTE = "voting/CASTING_VOTE";
export const CASTING_VOTE_FINISHED = "voting/CASTING_VOTE_FINISHED";
export const CASTING_VOTE_ERROR = "voting/CASTING_VOTE_ERROR";

export const fetchVotingItems = () => ({
  type: FETCH_VOTING_ITEMS,
});

export const fetchingVotingItems = () => ({
  type: FETCHING_VOTING_ITEMS,
});

export const finishedFetchingVotingItems = () => ({
  type: FINISHED_FETCHING_VOTING_ITEMS,
});

export const updateVotingItems = (votingItems) => ({
  type: UPDATE_VOTING_ITEMS,
  payload: {
    votingItems,
  },
});

export const votingItemsError = (error) => ({
  type: VOTING_ITEMS_ERROR,
  payload: {
    error,
  },
});

export const castVote = () => ({
  type: CAST_VOTE,
});

export const castingVote = () => ({
  type: CASTING_VOTE,
});

export const castingVoteFinished = () => ({
  type: CASTING_VOTE_FINISHED,
});

export const castingVoteError = (error) => ({
  type: CASTING_VOTE_ERROR,
  payload: {
    error,
  },
});
