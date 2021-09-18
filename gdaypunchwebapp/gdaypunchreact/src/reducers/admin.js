import {
  DO_UPDATE_TWEET_IMAGE,
  DO_UPDATE_TWEET_STATUS,
  DO_UPDATE_RETWEET_URL,
  TWEET_ERROR,
  TWEET_LOADING,
  TWEET_FINISHED,
  TWEET_RESET,
  SET_DELETING_TWEET,
  UPDATE_PROMPTS,
  START_FETCHING_PROMPTS,
  FINISH_FETCHING_PROMPTS,
  RESET_FETCHING_PROMPTS_STATUS,
  START_FETCHING_PANEL_STYLE_PROMPT,
  FINISH_FETCHING_PANEL_STYLE_PROMPT,
  UPDATE_PANEL_STYLE_PROMPT,
  UPDATE_STRIPE_PRODUCTS,
  FETCHING_STRIPE_PRODUCTS,
  FINISHED_FETCHING_STRIPE_PRODUCTS,
  UPDATE_ADMIN_PRODUCTS,
  FETCHING_ADMIN_PRODUCTS,
  FINISHED_FETCHING_ADMIN_PRODUCTS,
  SET_EDITING_PRODUCT,
  UPDATE_STRIPE_PRICES,
  FETCHING_STRIPE_PRICES,
  FINISHED_FETCHING_STRIPE_PRICES,
  FETCHING_CONTACT_ENTRIES,
  FINISHED_FETCHING_CONTACT_ENTRIES,
  UPDATE_CONTACT_ENTRIES,
  FETCHING_COUPONS,
  FINISHED_FETCHING_COUPONS,
  UPDATE_COUPONS,
  UPDATE_ORDERS,
  FETCHING_ORDERS,
  FINISHED_FETCHING_ORDERS,
  UPDATE_ORDER_STATUS_UPDATES,
  SET_SELECTED_ORDER,
  UPDATE_ORDER,
  UPDATE_STATUS_REASON,
} from "actions/admin";
import { arrayIdsMapToObject } from "utils/utils";

const INITIAL_STATE = {
  tweetLoading: false,
  tweetSuccess: false,
  tweetError: undefined,
  pendingTweet: {
    image: undefined,
    status: undefined,
    retweetUrl: undefined,
  },
  pendingDeletingTweetId: undefined,
  embeddedTweet: {
    html: undefined,
    id: undefined,
  },

  prompts: [],
  fetchingPrompts: false,
  fetchingPromptsSucess: false,
  panelStylePrompt: undefined,
  fetchingPanelStylePrompt: false,
  fetchingPanelStylePromptSucess: false,

  products: {
    adminProductList: [],
    stripeProductList: [],
    stripePrices: [],
    stripePriceIds: [],
    fetchingStripeProducts: false,
    finishedFetchingStripeProducts: false,
    fetchingAdminProducts: false,
    finishedFetchingAdminProducts: false,
    editingProduct: undefined,
    fetchingStripePrices: false,
    finishedFetchingStripePrices: false,
  },

  contacts: {
    contactEntries: [],
    fetchingContactEntries: false,
    finishedFetchingContactEntries: false,
  },

  coupons: {
    couponList: [],
    fetching: false,
    finishedFetching: false,
  },

  orders: {
    orderList: [],
    count: 0,
    next: undefined,
    fetching: false,
    finishedFetching: false,
    selected: undefined,
    reason: undefined,
  },
};

export const adminReducer = (state = INITIAL_STATE, action) => {
  const { payload } = action;

  switch (action.type) {
    case TWEET_ERROR:
      return {
        ...state,
        tweetLoading: false,
        tweetError: payload.error,
      };
    case TWEET_LOADING:
      return {
        ...state,
        tweetLoading: true,
      };
    case TWEET_FINISHED:
      return {
        ...state,
        embeddedTweet: payload.embedded,
        tweetLoading: false,
        tweetSuccess: true,
        pendingTweet: {
          image: undefined,
          status: undefined,
        },
      };
    case TWEET_RESET:
      return {
        ...state,
        tweetSuccess: false,
      };
    case SET_DELETING_TWEET:
      return {
        ...state,
        pendingDeletingTweetId: payload.statusId,
      };
    case DO_UPDATE_TWEET_IMAGE:
      return {
        ...state,
        pendingTweet: {
          ...state.pendingTweet,
          image: payload.image,
        },
      };
    case DO_UPDATE_RETWEET_URL:
      return {
        ...state,
        pendingTweet: {
          ...state.pendingTweet,
          retweetUrl: payload.url,
        },
      };
    case DO_UPDATE_TWEET_STATUS:
      return {
        ...state,
        pendingTweet: {
          ...state.pendingTweet,
          status: payload.status,
        },
      };
    case UPDATE_PROMPTS:
      return {
        ...state,
        ...payload,
      };
    case START_FETCHING_PROMPTS:
      return {
        ...state,
        fetchingPrompts: true,
        fetchingPromptsSucess: false,
      };
    case FINISH_FETCHING_PROMPTS:
      return {
        ...state,
        fetchingPrompts: false,
        fetchingPromptsSucess: true,
      };
    case UPDATE_PANEL_STYLE_PROMPT:
      return {
        ...state,
        panelStylePrompt: action.payload.prompt,
      };
    case START_FETCHING_PANEL_STYLE_PROMPT:
      return {
        ...state,
        fetchingPanelStylePrompt: true,
        fetchingPanelStylePromptSucess: false,
      };
    case FINISH_FETCHING_PANEL_STYLE_PROMPT:
      return {
        ...state,
        fetchingPanelStylePrompt: false,
        fetchingPanelStylePromptSucess: true,
      };
    case RESET_FETCHING_PROMPTS_STATUS:
      return {
        ...state,
        fetchingPromptsSucess: false,
      };
    case UPDATE_STRIPE_PRODUCTS:
      return {
        ...state,
        products: {
          ...state.products,
          stripeProductList: payload.products,
        },
      };
    case FETCHING_STRIPE_PRODUCTS:
      return {
        ...state,
        products: {
          ...state.products,
          fetchingStripeProducts: true,
          finishedFetchingStripeProducts: false,
        },
      };
    case FINISHED_FETCHING_STRIPE_PRODUCTS:
      return {
        ...state,
        products: {
          ...state.products,
          fetchingStripeProducts: false,
          finishedFetchingStripeProducts: true,
        },
      };
    case UPDATE_ADMIN_PRODUCTS:
      return {
        ...state,
        products: {
          ...state.products,
          adminProductList: payload.products,
        },
      };
    case FETCHING_ADMIN_PRODUCTS:
      return {
        ...state,
        products: {
          ...state.products,
          fetchingAdminProducts: true,
          finishedFetchingAdminProducts: false,
        },
      };
    case FINISHED_FETCHING_ADMIN_PRODUCTS:
      return {
        ...state,
        products: {
          ...state.products,
          fetchingAdminProducts: false,
          finishedFetchingAdminProducts: true,
        },
      };
    case SET_EDITING_PRODUCT:
      return {
        ...state,
        products: {
          ...state.products,
          editingProduct: action.payload.productId,
        },
      };
    case UPDATE_STRIPE_PRICES:
      return {
        ...state,
        products: {
          ...state.products,
          stripePrices: action.payload.prices,
          stripePriceIds: action.payload.prices.map((price) => price.id),
        },
      };
    case FETCHING_STRIPE_PRICES:
      return {
        ...state,
        products: {
          ...state.products,
          fetchingStripePrices: true,
          finishedFetchingStripePrices: false,
        },
      };
    case FINISHED_FETCHING_STRIPE_PRICES:
      return {
        ...state,
        products: {
          ...state.products,
          fetchingStripePrices: false,
          finishedFetchingStripePrices: true,
        },
      };
    case UPDATE_CONTACT_ENTRIES:
      return {
        ...state,
        contacts: {
          ...state.contacts,
          contactEntries: action.payload.entries,
        },
      };
    case FETCHING_CONTACT_ENTRIES:
      return {
        ...state,
        contacts: {
          ...state.contacts,
          fetchingContactEntries: true,
          finishedFetchingContactEntries: false,
        },
      };
    case FINISHED_FETCHING_CONTACT_ENTRIES:
      return {
        ...state,
        contacts: {
          ...state.contacts,
          fetchingContactEntries: false,
          finishedFetchingContactEntries: true,
        },
      };
    case UPDATE_COUPONS:
      return {
        ...state,
        coupons: {
          ...state.coupons,
          couponList: action.payload.coupons,
        },
      };
    case FETCHING_COUPONS:
      return {
        ...state,
        coupons: {
          ...state.coupons,
          fetching: true,
          finishedFetching: false,
        },
      };
    case FINISHED_FETCHING_COUPONS:
      return {
        ...state,
        coupons: {
          ...state.coupons,
          fetching: false,
          finishedFetching: true,
        },
      };
    case UPDATE_ORDERS:
      const { results, count, next } = action.payload.orders;
      return {
        ...state,
        orders: {
          ...state.orders,
          next,
          count,
          orderList: {
            ...state.orders.orderList,
            ...arrayIdsMapToObject(results),
          },
        },
      };
    case UPDATE_ORDER_STATUS_UPDATES:
      return {
        ...state,
        orders: {
          ...state.orders,
          orderList: {
            ...state.orders.orderList,
            [action.payload.orderId]: {
              ...state.orders.orderList[action.payload.orderId],
              statuses: action.payload.statusUpdates,
            },
          },
        },
      };
    case UPDATE_ORDER:
      return {
        ...state,
        orders: {
          ...state.orders,
          orderList: {
            ...state.orders.orderList,
            [action.payload.order.id]: {
              ...state.orders.orderList[action.payload.order.id],
              ...action.payload.order,
            },
          },
        },
      };
    case UPDATE_STATUS_REASON:
      return {
        ...state,
        orders: {
          ...state.orders,
          reason: action.payload.reason,
        },
      };
    case SET_SELECTED_ORDER:
      return {
        ...state,
        orders: {
          ...state.orders,
          selected: action.payload.orderId,
        },
      };
    case FETCHING_ORDERS:
      return {
        ...state,
        orders: {
          ...state.orders,
          fetching: true,
          finishedFetching: false,
        },
      };
    case FINISHED_FETCHING_ORDERS:
      return {
        ...state,
        orders: {
          ...state.orders,
          fetching: false,
          finishedFetching: true,
        },
      };
    default:
      return state;
  }
};
