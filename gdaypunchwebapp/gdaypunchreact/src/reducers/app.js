import { combineReducers } from "redux";
import { DO_LOGIN } from "actions/user";

const INITIAL_STATE = {
  loggingIn: false
};

const appReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DO_LOGIN:
      return {
        ...state,
        loggingIn: true
      };
    default:
      return state;
  }
};

export default combineReducers({
  app: appReducer
});
