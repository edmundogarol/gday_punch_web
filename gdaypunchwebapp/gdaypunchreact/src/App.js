import React, { useEffect } from "react";
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

import appReducer from "reducers/app";
import appSaga from "sagas/app";
import mangaSaga from "sagas/manga";
import adminSaga from "sagas/admin";
import { doCheckLogin } from "actions/user";
import { selectUser, selectLoginCheckFinished } from "selectors/app";
import Footer from "components/footer";
import Navigation from "components/navigation";

import Home from "pages/home";
import DailyPrompt from "pages/DailyPrompt";
import Admin from "pages/admin";
import Reader from "pages/Reader";
import PageNotFound from "pages/PageNotFound";

import "antd/dist/antd.css";
import "./App.scss";
/**
 * Set up and run app sagas listening for events
 */
function* rootSaga() {
  yield all([appSaga(), mangaSaga(), adminSaga()]);
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
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/shop" component={Home} />
            <Route exact path="/contact" component={Home} />
            <Route exact path="/about" component={Home} />
            {loginCheckFinished && !user.logged_in ? (
              <Redirect to="/" />
            ) : (
              <Route exact path="/manga/:id" component={Reader} />
            )}
            {user.is_staff ? (
              <Switch>
                <Route exact path="/admin" component={Admin} />
                <Route exact path="/admin/:app" component={Admin} />
                <Route exact path="/admin/:app/:productId" component={Admin} />
              </Switch>
            ) : (
              <Redirect to="/" />
            )}
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
