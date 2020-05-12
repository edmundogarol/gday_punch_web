import { combineReducers } from "redux";
import {
  DO_LOGIN,
  UPDATE_LOGIN_ERROR,
  UPDATE_REGISTRATION_ERROR,
  DO_REGISTRATION,
  CLOSE_REGISTRATION,
  OPEN_REGISTRATION,
  REGISTRATION_SUCCESS,
  SUGGEST_REGISTER_TO_CONTINUE,
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
    logged_in: false,
    roles: []
  },
  loginView: false,
  loginError: undefined,
  registrationError: undefined,
  pendingLogin: {},
  pendingRegistration: {},

  suggestRegistration: undefined
};

const appReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DO_LOGIN:
      return {
        ...state,
        pendingLogin: action.payload
      };
    case UPDATE_LOGIN_ERROR:
      return {
        ...state,
        registrationError: undefined,
        suggestRegistration: undefined,
        loginError: action.payload.error
      };
    case UPDATE_REGISTRATION_ERROR:
      return {
        ...state,
        loginError: undefined,
        suggestRegistration: undefined,
        registrationError: action.payload.error
      };
    case OPEN_REGISTRATION:
      return {
        ...state,
        loginView: true
      };
    case DO_REGISTRATION:
      return {
        ...state,
        pendingRegistration: action.payload
      };
    case CLOSE_REGISTRATION:
      return {
        ...state,
        loginView: false
      };
    case SUGGEST_REGISTER_TO_CONTINUE:
      return {
        ...state,
        loginError: undefined,
        registrationError: undefined,
        suggestRegistration: action.payload.message
      };
    case REGISTRATION_SUCCESS:
      return {
        ...state,
        pendingLogin: {},
        pendingRegistration: {}
      };
    case UPDATE_USER:
      return {
        ...state,
        loginError: undefined,
        registrationError: undefined,
        suggestRegistration: undefined,
        loginView: false,
        user: action.payload.user
      };
    default:
      return state;
  }
};

export default combineReducers({
  app: appReducer
});
