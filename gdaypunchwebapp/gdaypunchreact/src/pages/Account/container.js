import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import Ui from "./ui";

import {
  selectEmailVerificationState,
  selectGdaySubscriptionsProducts,
  selectProductsState,
  selectRegistrationError,
  selectUser,
} from "selectors/app";
import {
  doUpdateUserDetails,
  requestEmailVerification as requestEmailVerificationAction,
  updateRegistrationError,
} from "src/actions/user";
import { selectAccountOrdersState } from "src/selectors/account";
import { fetchAccountOrders as fetchAccountOrdersAction } from "src/actions/account";
import { fetchProducts as fetchProductsAction } from "src/actions/app";
import { updateCartItemQuantity as updateCartItemQuantityAction } from "actions/cart";

const mapState = createStructuredSelector({
  user: selectUser,
  emailVerificationState: selectEmailVerificationState,
  userUpdateError: selectRegistrationError,
  ordersState: selectAccountOrdersState,
  gdaySubscriptionProducts: selectGdaySubscriptionsProducts,
  productsState: selectProductsState,
});

const mapDispatch = {
  requestEmailVerification: requestEmailVerificationAction,
  updateUserDetails: doUpdateUserDetails,
  updateUserDetailsError: updateRegistrationError,
  fetchAccountOrders: fetchAccountOrdersAction,
  fetchProducts: fetchProductsAction,
  updateCartItemQuantity: updateCartItemQuantityAction,
};

export default connect(mapState, mapDispatch)(withRouter(Ui));
