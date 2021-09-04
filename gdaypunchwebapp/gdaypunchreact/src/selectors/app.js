import { createSelector } from "reselect";
import { orderBy } from "lodash";

const selectDomain = (state) => state.app;

export const selectUser = createSelector(selectDomain, ({ user }) => user);

export const selectLoginViewToggle = createSelector(
  selectDomain,
  ({ loginView }) => loginView
);

export const selectLoggedIn = createSelector(
  selectDomain,
  ({ user }) => user.logged_in || false
);

export const selectLoginError = createSelector(
  selectDomain,
  ({ loginError }) => loginError
);

export const selectLoginCheckFinished = createSelector(
  selectDomain,
  ({ loginCheckFinished }) => loginCheckFinished
);

export const selectRegistrationError = createSelector(
  selectDomain,
  ({ registrationError }) => registrationError
);

export const selectPendingLogin = createSelector(
  selectDomain,
  ({ pendingLogin }) => pendingLogin
);

export const selectPendingRegistration = createSelector(
  selectDomain,
  ({ pendingRegistration }) => pendingRegistration
);

export const selectSuggestRegistration = createSelector(
  selectDomain,
  ({ suggestRegistration }) => suggestRegistration || ""
);

export const selectEmailVerificationState = createSelector(
  selectDomain,
  ({ emailVerification }) => emailVerification
);

export const selectProductsState = createSelector(
  selectDomain,
  ({ products }) => products
);

export const selectProductList = createSelector(
  selectDomain,
  ({ products: { productList } }) => productList
);

export const selectBuyableProducts = createSelector(
  selectDomain,
  ({ products: { productList } }) => {
    const list = Object.values(productList).filter(
      (product) => product.active_price > 0
    );
    return orderBy(list, "id", "desc");
  }
);

export const selectFreeProducts = createSelector(
  selectDomain,
  ({ products: { productList } }) => {
    const list = Object.values(productList).filter(
      (product) => product.active_price === 0
    );
    return orderBy(list, "id", "desc");
  }
);

export const selectContactState = createSelector(
  selectDomain,
  ({ contact }) => contact
);

export const selectResetPasswordState = createSelector(
  selectDomain,
  ({ resetPassword }) => resetPassword
);

export const selectCartState = createSelector(selectDomain, ({ cart }) => cart);

export const selectSideCartOpen = createSelector(
  selectDomain,
  ({ cart: { sideCartOpen } }) => sideCartOpen
);

export const selectCartCount = createSelector(
  selectDomain,
  ({ products: { productList } }) => {
    let count = 0;
    Object.values(productList).map((product) => {
      if (product.quantity) count += product.quantity;
    });
    return count;
  }
);

export const selectCartTotal = createSelector(
  selectDomain,
  ({ products: { productList } }) => {
    let total = 0;
    Object.values(productList).map((product) => {
      if (product.quantity) total += product.quantity * product.active_price;
    });
    return total;
  }
);

export const selectPaymentClientSecret = createSelector(
  selectDomain,
  ({ payment: { clientSecret } }) => clientSecret
);
