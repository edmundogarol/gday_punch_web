import { DO_TWEET } from "actions/admin";

const INITIAL_STATE = {
  pendingTweet: {}
};

export const adminReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DO_TWEET:
      return {
        ...state,
        pendingTweet: action.payload
      };
    default:
      return state;
  }
};
