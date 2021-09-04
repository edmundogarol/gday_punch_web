import { set, unset, remove } from "lodash";
import { combineReducers } from "redux";
import { adminReducer } from "./admin";
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
  CLEAR_LOGIN_ERROR,
  UPDATE_RESET_PASSWORD_ERRORS,
  RESET_PASSWORD_SUBMITTED,
  RESET_PASSWORD,
  RESET_PASSWORD_VERIFICATION_TOKEN,
  RESET_PASSWORD_SUBMIT_NEW,
  VERIFYING_EMAIL,
  VERIFYING_EMAIL_FINISHED,
  EMAIL_VERIFIED,
} from "actions/user";
import {
  FETCHING_PRODUCTS,
  FINISHED_FETCHING_PRODUCTS,
  UPDATE_PRODUCTS,
  UPDATE_CONTACT_FORM_ERRORS,
  UPDATE_CONTACT_FORM_SUBMITTED,
} from "actions/app";
import {
  FETCHING_CART_ITEMS,
  FINISHED_FETCHING_CART_ITEMS,
  TOGGLE_SIDE_CART,
  UPDATE_CART_ITEM_QUANTITY,
  REMOVE_CART_ITEM,
} from "actions/cart";
import {
  SET_VIEWING_PRODUCT,
  FETCHING_VIEWING_PRODUCT,
  FINISHED_FETCHING_VIEWING_PRODUCT,
} from "actions/products";
import {
  UPDATE_MANGA,
  SET_READING_MANGA,
  UPDATE_COMMENTS,
  UPDATE_COMMENT,
} from "actions/manga";
import { PAYMENT_INTENT_UPDATE } from "src/actions/payment";
import { CUSTOMER_SUBSCRIBE_FINISHED } from "src/actions/customer";

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
    verified: false,
  },

  emailVerification: {
    verifying: false,
    verifyingFinished: false,
    error: undefined,
  },

  loginView: false,
  loginCheckFinished: false,
  loginError: undefined,
  registrationError: undefined,
  pendingLogin: {},
  pendingRegistration: {},
  suggestRegistration: undefined,

  resetPassword: {
    errors: {},
    submitting: false,
    submitted: false,
    verifiedToken: undefined,
  },

  products: {
    productList: {},
    fetchingProducts: false,
    finishedFetchingProducts: false,
    viewingProduct: undefined,
    fetchingViewingProduct: false,
    finishedFetchingViewingProduct: false,
  },

  contact: {
    errors: [],
    submitted: false,
  },

  cart: {
    fetchingCartItems: false,
    finishedFetchingCartItems: false,
    sideCartOpen: false,
  },

  payment: {
    clientSecret: undefined,
  },

  customer: {
    subscribeCallFinished: false,
  },

  reader: {
    mangaId: undefined,
    comments: [],
  },
};

const appReducer = (state = INITIAL_STATE, action) => {
  const { payload } = action;
  switch (action.type) {
    case DO_LOGIN:
      return {
        ...state,
        pendingLogin: payload,
      };
    case UPDATE_LOGIN_ERROR:
      return {
        ...state,
        registrationError: undefined,
        suggestRegistration: undefined,
        loginError: payload.error,
      };
    case CLEAR_LOGIN_ERROR:
      return {
        ...state,
        loginError: undefined,
      };
    case UPDATE_REGISTRATION_ERROR:
      return {
        ...state,
        loginError: undefined,
        suggestRegistration: undefined,
        registrationError: payload.error,
      };
    case OPEN_REGISTRATION:
      return {
        ...state,
        loginView: true,
      };
    case DO_REGISTRATION:
      return {
        ...state,
        pendingRegistration: payload,
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
        suggestRegistration: payload.message,
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
        user: { ...state.user, ...payload.user },
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
    case VERIFYING_EMAIL:
      return {
        ...state,
        emailVerification: {
          ...state.emailVerification,
          verifying: true,
          verifyingFinished: false,
        },
      };
    case VERIFYING_EMAIL_FINISHED:
      return {
        ...state,
        emailVerification: {
          ...state.emailVerification,
          verifying: false,
          verifyingFinished: true,
          error: payload.error,
        },
      };
    case EMAIL_VERIFIED:
      return {
        ...state,
        user: {
          ...payload.user,
          verified: true,
        },
      };
    case UPDATE_PRODUCTS:
      const { adding } = payload;
      let newProductList = [];
      if (adding) {
        newProductList = state.products.productList;
        payload.products.map((product) =>
          set(newProductList, product.id, product)
        );
      }
      return {
        ...state,
        products: {
          ...state.products,
          productList: adding ? newProductList : payload.products,
        },
      };
    case FETCHING_PRODUCTS:
      return {
        ...state,
        products: {
          ...state.products,
          fetchingProducts: true,
          finishedFetchingProducts: false,
        },
      };
    case FINISHED_FETCHING_PRODUCTS:
      return {
        ...state,
        products: {
          ...state.products,
          fetchingProducts: false,
          finishedFetchingProducts: true,
        },
      };
    case UPDATE_CONTACT_FORM_ERRORS:
      return {
        ...state,
        contact: {
          ...state.contact,
          errors: payload.errors,
        },
      };
    case UPDATE_CONTACT_FORM_SUBMITTED:
      return {
        ...state,
        contact: {
          ...state.contact,
          submitted: payload.submitted,
          errors: [],
        },
      };
    case RESET_PASSWORD:
      return {
        ...state,
        resetPassword: {
          ...state.resetPassword,
          submitting: true,
        },
      };
    case UPDATE_RESET_PASSWORD_ERRORS:
      return {
        ...state,
        resetPassword: {
          ...state.resetPassword,
          errors: payload.errors,
          submitting: false,
        },
      };
    case RESET_PASSWORD_SUBMITTED:
      return {
        ...state,
        resetPassword: {
          ...state.resetPassword,
          submitted: payload.submitted,
          errors: payload.keepErrors ? state.resetPassword.errors : [],
          submitting: false,
        },
      };
    case RESET_PASSWORD_VERIFICATION_TOKEN:
      return {
        ...state,
        resetPassword: {
          ...state.resetPassword,
          verifiedToken: payload.token,
        },
      };
    case RESET_PASSWORD_SUBMIT_NEW:
      return {
        ...state,
        resetPassword: {
          ...state.resetPassword,
          submitting: true,
        },
      };
    case UPDATE_CART_ITEM_QUANTITY:
      const modifyingItem = state.products.productList[payload.productId];
      return {
        ...state,
        products: {
          ...state.products,
          productList: {
            ...state.products.productList,
            [modifyingItem.id]: {
              ...modifyingItem,
              quantity: payload.addOnTop
                ? (modifyingItem.quantity || 0) + payload.quantity
                : payload.quantity,
            },
          },
        },
        cart: {
          ...state.cart,
          sideCartOpen: payload.openSideCart,
        },
      };
    case REMOVE_CART_ITEM:
      const updatedProduct = state.products.productList[payload.productId];
      unset(updatedProduct, "quantity");
      return {
        ...state,
        products: {
          ...state.products,
          productList: {
            ...state.products.productList,
            [updatedProduct.id]: updatedProduct,
          },
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
          sideCartOpen: payload.open,
        },
      };
    case SET_VIEWING_PRODUCT:
      return {
        ...state,
        products: {
          ...state.products,
          viewingProduct: payload.productId,
        },
      };
    case FETCHING_VIEWING_PRODUCT:
      return {
        ...state,
        products: {
          ...state.products,
          fetchingViewingProduct: true,
          finishedFetchingViewingProduct: false,
        },
      };
    case FINISHED_FETCHING_VIEWING_PRODUCT:
      return {
        ...state,
        products: {
          ...state.products,
          fetchingViewingProduct: false,
          finishedFetchingViewingProduct: true,
        },
      };
    case SET_READING_MANGA:
      return {
        ...state,
        reader: {
          ...state.reader,
          mangaId: payload.mangaId,
        },
      };
    case UPDATE_MANGA:
      const { manga } = payload;
      const { id: mangaId } = manga;
      const updatingProductManga = Object.values(
        state.products.productList
      ).find((product) => {
        return product.id && product.manga_details.id === mangaId;
      });

      if (!updatingProductManga) {
        return {
          ...state,
          products: {
            ...state.products,
            productList: {
              ...state.products.productList,
              [`temp-product-${mangaId}`]: {
                ...updatingProductManga,
                manga_details: manga,
              },
            },
          },
        };
      }
      return {
        ...state,
        products: {
          ...state.products,
          productList: {
            ...state.products.productList,
            [updatingProductManga.id]: {
              ...updatingProductManga,
              manga_details: {
                ...updatingProductManga.manga_details,
                likes: manga.likes,
                user_likes: manga.user_likes,
                comments: manga.comments,
              },
            },
          },
        },
      };
    case UPDATE_COMMENTS:
      return {
        ...state,
        reader: {
          ...state.reader,
          comments: payload.comments,
        },
      };
    case UPDATE_COMMENT:
      remove(state.reader.comments, (comment) => {
        return comment.id === payload.comment.id;
      });
      return {
        ...state,
        reader: {
          ...state.reader,
          comments: [...state.reader.comments, payload.comment],
        },
      };
    case PAYMENT_INTENT_UPDATE:
      return {
        ...state,
        payment: {
          clientSecret: payload.clientSecret,
        },
      };
    case CUSTOMER_SUBSCRIBE_FINISHED:
      return {
        ...state,
        customer: {
          ...state.customer,
          subscribeCallFinished: true,
        },
      };
    default:
      return state;
  }
};

export default combineReducers({
  app: appReducer,
  admin: adminReducer,
});
