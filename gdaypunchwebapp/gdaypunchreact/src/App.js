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

import appReducer from "reducers/app";

import { doCheckLogin } from "actions/user";

import { selectUser, selectLoginCheckFinished } from "selectors/app";

import Home from "pages/Home";
import DailyPrompt from "pages/DailyPrompt";
import Admin from "pages/Admin";
import Shop from "pages/Shop";
import About from "pages/About";
import Contact from "pages/Contact";
import Account from "pages/Account";
import ResetPassword from "pages/ResetPassword";
import ResetPasswordNewPassword from "pages/ResetPassword/newPassword";
import VerifyEmail from "pages/VerifyEmail";
import Cart from "pages/Cart";
import Checkout from "pages/Checkout";
import RefundsAndReturns from "pages/RefundsAndReturns";
import ProductDetail from "pages/ProductDetail";
import Reader from "pages/Reader";
import PageNotFound from "pages/PageNotFound";

import SideCart from "components/sideCart";
import Footer from "components/footer";
import Navigation from "components/navigation";

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
  ]);
}

const stripePromise = loadStripe(
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

  const gdayPunchIssue1 =
    "https://gdaypunch-static.s3-us-west-2.amazonaws.com/compressed_gpmm-1-digital-compressed-s.pdf";

  const gdayPunchIssue4 =
    "https://gdaypunch-static.s3-us-west-2.amazonaws.com/gpmm-4-digital-compressed-s.pdf";

  const orientation = "japanese";

  class ProtectedRoute extends Component {
    render() {
      const { ...props } = this.props;

      if (props.condition) return <Route {...props} />;
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
            <Reader
              file={gdayPunchIssue1}
              orientation={"english"}
              pageCount={104}
              readerOnly
            />
          )}
        />
        <Route
          exact
          path="/gpmm/4"
          component={() => (
            <Reader
              file={gdayPunchIssue4}
              orientation={"english"}
              pageCount={104}
              readerOnly
            />
          )}
        />
        <Route exact path="/daily-prompt" component={DailyPrompt} />
        <Route path="/">
          <Navigation />
          <SideCart />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/shop" component={Shop} />
            <Route exact path="/contact" component={Contact} />
            <Route exact path="/about" component={About} />
            <Route exact path="/cart" component={Cart} />
            <Route exact path="/checkout" component={Checkout} />
            <Route exact path="/forgot-password" component={ResetPassword} />
            <Route
              exact
              path="/password-reset-consume/:consumer"
              component={ResetPassword}
            />
            <Route
              exact
              path="/password-reset-confirm"
              component={ResetPasswordNewPassword}
            />
            <Route
              exact
              path="/verify-account/:token"
              component={VerifyEmail}
            />
            <Route
              exact
              path="/refunds-and-returns"
              component={RefundsAndReturns}
            />
            <Route
              exact
              path="/product/:productId/:productUri"
              component={ProductDetail}
            />
            <ProtectedRoute
              condition={loginCheckFinished && user.logged_in}
              exact
              path="/account"
              component={Account}
            />
            <ProtectedRoute
              condition={
                loginCheckFinished &&
                user.logged_in &&
                user.verified === "verified"
              }
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
            <Route component={PageNotFound} />
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
