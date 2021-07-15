import { unset } from "lodash";
import { combineReducers } from "redux";
import { mangaReducer } from "./manga";
import { adminReducer } from "./admin";
import { homeReducer } from "./home";
import {
  DO_LOGIN,
  LOGOUT_SUCESS,
  UPDATE_LOGIN_ERROR,
  UPDATE_REGISTRATION_ERROR,
  DO_REGISTRATION,
  CLOSE_REGISTRATION,
  OPEN_REGISTRATION,
  REGISTRATION_SUCCESS,
  SUGGEST_REGISTER_TO_CONTINUE,
  UPDATE_USER,
} from "actions/user";
import {
  UPDATE_CONTACT_FORM_ERRORS,
  UPDATE_CONTACT_FORM_SUBMITTED,
} from "actions/app";
import {
  FETCHING_CART_ITEMS,
  FINISHED_FETCHING_CART_ITEMS,
  UPDATE_CART_ITEMS,
  TOGGLE_SIDE_CART,
  UPDATE_CART_ITEM_QUANTITY,
  REMOVE_CART_ITEM,
} from "actions/cart";

const INITIAL_STATE = {
  user: {
    id: undefined,
    first_name: undefined,
    last_name: undefined,
    username: undefined,
    email: undefined,
    bio: undefined,
    location: undefined,
    birth_date: undefined,
    logged_in: false,
    is_staff: false,
    roles: [],
  },

  loginView: false,
  loginCheckFinished: false,
  loginError: undefined,
  registrationError: undefined,
  pendingLogin: {},
  pendingRegistration: {},
  suggestRegistration: undefined,

  contact: {
    errors: [],
    submitted: false,
  },

  cart: {
    items: {},
    fetchingCartItems: false,
    finishedFetchingCartItems: false,
    sideCartOpen: false,
  },
};

const appReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DO_LOGIN:
      return {
        ...state,
        pendingLogin: action.payload,
      };
    case UPDATE_LOGIN_ERROR:
      return {
        ...state,
        registrationError: undefined,
        suggestRegistration: undefined,
        loginError: action.payload.error,
      };
    case UPDATE_REGISTRATION_ERROR:
      return {
        ...state,
        loginError: undefined,
        suggestRegistration: undefined,
        registrationError: action.payload.error,
      };
    case OPEN_REGISTRATION:
      return {
        ...state,
        loginView: true,
      };
    case DO_REGISTRATION:
      return {
        ...state,
        pendingRegistration: action.payload,
      };
    case CLOSE_REGISTRATION:
      return {
        ...state,
        loginView: false,
      };
    case SUGGEST_REGISTER_TO_CONTINUE:
      return {
        ...state,
        loginError: undefined,
        registrationError: undefined,
        suggestRegistration: action.payload.message,
      };
    case REGISTRATION_SUCCESS:
      return {
        ...state,
        pendingLogin: {},
        pendingRegistration: {},
      };
    case UPDATE_USER:
      return {
        ...state,
        loginError: undefined,
        registrationError: undefined,
        suggestRegistration: undefined,
        loginView: false,
        user: { ...state.user, ...action.payload.user },
        loginCheckFinished: true,
      };
    case LOGOUT_SUCESS:
      return {
        ...state,
        loginError: undefined,
        registrationError: undefined,
        suggestRegistration: undefined,
        loginView: false,
        user: INITIAL_STATE.user,
        loginCheckFinished: true,
      };
    case UPDATE_CONTACT_FORM_ERRORS:
      return {
        ...state,
        contact: {
          ...state.contact,
          errors: action.payload.errors,
        },
      };
    case UPDATE_CONTACT_FORM_SUBMITTED:
      return {
        ...state,
        contact: {
          ...state.contact,
          submitted: action.payload.submitted,
          errors: [],
        },
      };
    case UPDATE_CART_ITEMS:
      const existingItem = state.cart.items[action.payload.items.id];
      const newItems = {
        ...state.cart.items,
        [action.payload.items.id]: existingItem
          ? { ...existingItem, quantity: existingItem.quantity + 1 }
          : { ...action.payload.items, quantity: 1 },
      };
      return {
        ...state,
        cart: {
          ...state.cart,
          items: action.payload.addItems ? newItems : action.payload.items,
          sideCartOpen: action.payload.addItems,
        },
      };
    case UPDATE_CART_ITEM_QUANTITY:
      const modifyingItem = state.cart.items[action.payload.productId];

      return {
        ...state,
        cart: {
          ...state.cart,
          items: {
            ...state.cart.items,
            [action.payload.productId]: {
              ...modifyingItem,
              quantity: action.payload.quantity,
            },
          },
        },
      };
    case REMOVE_CART_ITEM:
      const updatedItems = state.cart.items;
      unset(updatedItems, action.payload.productId);
      return {
        ...state,
        cart: {
          ...state.cart,
          items: updatedItems,
        },
      };
    case FETCHING_CART_ITEMS:
      return {
        ...state,
        cart: {
          ...state.cart,
          fetchingCartItems: true,
          finishedFetchingCartItems: false,
        },
      };
    case FINISHED_FETCHING_CART_ITEMS:
      return {
        ...state,
        cart: {
          ...state.cart,
          fetchingCartItems: false,
          finishedFetchingCartItems: true,
        },
      };
    case TOGGLE_SIDE_CART:
      return {
        ...state,
        cart: {
          ...state.cart,
          sideCartOpen: action.payload.open,
        },
      };
    default:
      return state;
  }
};

export default combineReducers({
  app: appReducer,
  manga: mangaReducer,
  admin: adminReducer,
  home: homeReducer,
});
