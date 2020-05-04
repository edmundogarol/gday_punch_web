import { combineReducers } from "redux";
import { DO_LOGIN, CLOSE_LOGIN } from "actions/user";

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
    case CLOSE_LOGIN:
      return {
        ...state,
        loggingIn: false
      };
    default:
      return state;
  }
};

export default combineReducers({
  app: appReducer
});
