import React, { Component, useEffect } from "react";
import { Provider, connect } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { createStore, applyMiddleware, compose } from "redux";
import { createStructuredSelector } from "reselect";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import appSaga from "sagas/app";
import mangaSaga from "sagas/manga";
import adminSaga from "sagas/admin";
import productSaga from "./sagas/products";
import customerSaga from "./sagas/customer";
import checkoutSaga from "./sagas/checkout";
import orderSaga from "./sagas/orders";
import accountSaga from "./sagas/account";
import resourcesSaga from "./sagas/resources";

import appReducer from "reducers/app";

import { doCheckLogin } from "actions/user";

import { selectUser, selectLoginCheckFinished } from "selectors/app";

import Home from "pages/Home";
import Admin from "pages/Admin";
import Shop from "pages/Shop";
import About from "pages/About";
import Contact from "pages/Contact";
import Account from "pages/Account";
import Bookshelf from "pages/Bookshelf";
import DailyPrompt from "pages/DailyPrompt";
import Events from "pages/Events";
import Vote from "pages/Vote";
import OneShotSubmissions from "pages/OneShotSubmissions";
import IllustrationSubmissions from "pages/IllustrationSubmissions";
import Downloads from "pages/ResourceDownloads";
import ResetPassword from "pages/ResetPassword";
import ResetPasswordNewPassword from "pages/ResetPassword/newPassword";
import VerifyEmail from "pages/VerifyEmail";
import Cart from "pages/Cart";
import Checkout from "pages/Checkout";
import RefundsAndReturns from "pages/RefundsAndReturns";
import SubmissionConditions from "pages/SubmissionConditions";
import OrderConfirmation from "pages/OrderConfirmation";
import ProductDetail from "pages/ProductDetail";
import Reader from "pages/Reader";
import PageNotFound from "pages/PageNotFound";
import Stall from "pages/Stall/Stall";

import Navigation from "components/Navigation/Navigation";
import RoutePage from "components/routePage";
import SideCart from "components/sideCart";
import Footer from "components/footer";

import "antd/dist/antd.css";
import "./App.scss";

/**
 * Set up and run app sagas listening for events
 */
function* rootSaga() {
  yield all([
    appSaga(),
    mangaSaga(),
    adminSaga(),
    productSaga(),
    customerSaga(),
    checkoutSaga(),
    orderSaga(),
    accountSaga(),
    resourcesSaga(),
  ]);
}

const stripePromise = loadStripe(
  // eslint-disable-next-line no-undef
  process.env.NODE_ENV === "development"
    ? "pk_test_QgTiwo4w3EXdQS9hOywypRAF"
    : "pk_live_mTfZz6d7N3Lm44Wgqbzn24Tf"
);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  appReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);
sagaMiddleware.run(rootSaga);

function Root(props) {
  const { user, loginCheckFinished } = props;

  useEffect(() => {
    props.checkLogin();
  }, []);

  class ProtectedRoute extends Component {
    render() {
      const { ...props } = this.props;

      if (props.condition) return <RoutePage {...props} />;
      return <Redirect to="/" />;
    }
  }

  return (
    <Router history={history}>
      <Switch>
        <Route
          exact
          path="/gpmm/1"
          component={() => (
            <Reader defaultManga={1} pageCount={104} readerOnly />
          )}
        />
        <Route
          exact
          path="/gpmm/4"
          component={() => (
            <Reader defaultManga={4} pageCount={104} readerOnly />
          )}
        />
        <Route path="/">
          <Navigation />
          <SideCart />
          <Switch>
            <RoutePage exact path="/" component={Home} />
            <RoutePage exact path="/shop" component={Shop} title="Shop" />
            <RoutePage
              exact
              path="/contact"
              component={Contact}
              title="Contact"
            />
            <RoutePage exact path="/about" component={About} />
            <RoutePage
              exact
              path="/conditions"
              component={SubmissionConditions}
            />
            <RoutePage exact path="/daily-prompt" component={DailyPrompt} />
            <RoutePage
              exact
              path="/one-shots"
              component={OneShotSubmissions}
              title="One Shot Submissions"
            />
            <RoutePage
              exact
              path="/illustrations"
              component={IllustrationSubmissions}
              title="Illustration Submissions"
            />
            <RoutePage exact path="/vote" component={Vote} title="Vote" />
            <RoutePage exact path="/events" component={Events} title="Events" />
            <RoutePage exact path="/downloads" component={Downloads} />
            <RoutePage exact path="/cart" component={Cart} />
            <RoutePage exact path="/checkout" component={Checkout} />
            <ProtectedRoute
              exact
              path="/my-stall"
              component={Stall}
              title="My Stall"
              condition={user.logged_in}
            />
            <RoutePage
              exact
              path="/stall/:userId"
              titleSetInside
              component={Stall}
            />
            <RoutePage
              exact
              path="/forgot-password"
              component={ResetPassword}
            />
            <RoutePage
              exact
              path="/password-reset-consume/:consumer"
              component={ResetPassword}
            />
            <RoutePage
              exact
              path="/password-reset-confirm"
              component={ResetPasswordNewPassword}
            />
            <RoutePage
              exact
              path="/verify-account/:token"
              component={VerifyEmail}
            />
            <RoutePage
              exact
              path="/refunds-and-returns"
              component={RefundsAndReturns}
            />
            <RoutePage
              exact
              path="/product/:productId/:productUri"
              component={ProductDetail}
              titleSetInside
            />
            <RoutePage
              exact
              path="/order-confirmation/:orderSecret"
              component={OrderConfirmation}
              titleSetInside
            />
            <ProtectedRoute
              condition={user.logged_in}
              exact
              path="/account"
              component={Account}
            />
            <ProtectedRoute
              condition={user.logged_in}
              exact
              path="/account/:tab"
              component={Account}
            />
            <ProtectedRoute
              condition={user.logged_in}
              exact
              path="/bookshelf"
              component={Bookshelf}
            />
            <ProtectedRoute
              condition={user.logged_in && user.verified === "verified"}
              titleSetInside
              exact
              path="/manga/:id"
              component={Reader}
            />
            <ProtectedRoute
              exact
              condition={user.is_staff}
              path="/admin"
              component={Admin}
            />
            <ProtectedRoute
              exact
              condition={user.is_staff}
              path="/admin/:app"
              component={Admin}
            />
            <ProtectedRoute
              exact
              condition={user.is_staff}
              path="/admin/:app/:productId"
              component={Admin}
            />
            <RoutePage component={PageNotFound} />
          </Switch>
          <Footer />
        </Route>
      </Switch>
    </Router>
  );
}

const mapStateToProps = createStructuredSelector({
  user: selectUser,
  loginCheckFinished: selectLoginCheckFinished,
});

const mapDispatchToProps = {
  checkLogin: doCheckLogin,
};

const RootContainer = connect(mapStateToProps, mapDispatchToProps)(Root);

function App() {
  return (
    <Provider store={store}>
      <Elements stripe={stripePromise}>
        <RootContainer />
      </Elements>
    </Provider>
  );
}

export default App;
