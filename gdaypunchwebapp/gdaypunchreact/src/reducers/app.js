import { combineReducers } from "redux";
import {
  DO_LOGIN,
  DO_REGISTRATION,
  CLOSE_REGISTRATION,
  OPEN_REGISTRATION,
  UPDATE_USER
} from "actions/user";

const INITIAL_STATE = {
  user: {
    first_name: undefined,
    last_name: undefined,
    username: undefined,
    email: undefined,
    bio: undefined,
    location: undefined,
    birth_date: undefined,
    roles: []
  },
  registrationToggle: false,
  registering: false,
  pendingLogin: {},
  pendingRegistration: {}
};

const appReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DO_LOGIN:
      return {
        ...state,
        pendingLogin: action.payload
      };
    case OPEN_REGISTRATION:
      return {
        ...state,
        registrationToggle: true
      };
    case DO_REGISTRATION:
      return {
        ...state,
        registering: true,
        pendingRegistration: action.payload
      };
    case CLOSE_REGISTRATION:
      return {
        ...state,
        registrationToggle: false
      };
    case UPDATE_USER:
      return {
        ...state,
        user: action.payload.user
      };
    default:
      return state;
  }
};

export default combineReducers({
  app: appReducer
});
