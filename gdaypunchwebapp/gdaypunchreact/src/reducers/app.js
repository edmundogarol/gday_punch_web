import { combineReducers } from "redux";
import {
  DO_REGISTRATION,
  CLOSE_REGISTRATION,
  OPEN_REGISTRATION
} from "actions/user";

const INITIAL_STATE = {
  registrationToggle: false,
  registering: false
};

const appReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case OPEN_REGISTRATION:
      return {
        ...state,
        registrationToggle: true
      };
    case DO_REGISTRATION:
      return {
        ...state,
        registering: true
      };
    case CLOSE_REGISTRATION:
      return {
        ...state,
        registrationToggle: false
      };
    default:
      return state;
  }
};

export default combineReducers({
  app: appReducer
});
