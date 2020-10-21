import React, { useEffect } from "react";
import { Provider, connect } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import { createStore, applyMiddleware, compose } from "redux";
import { createStructuredSelector } from "reselect";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";
import appReducer from "reducers/app";
import appSaga from "sagas/app";
import mangaSaga from "sagas/manga";
import adminSaga from "sagas/admin";
import { doCheckLogin } from "actions/user";
import { selectUser } from "selectors/app";
import Footer from "components/footer";
import Navigation from "components/navigation";

import Home from "pages/Home";
import Admin from "pages/Admin";
import Reader from "pages/Reader";
import PageNotFound from "pages/PageNotFound";
import "./App.scss";

/**
 * Set up and run app sagas listening for events
 */
function* rootSaga() {
  yield all([appSaga(), mangaSaga(), adminSaga()]);
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  appReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);
sagaMiddleware.run(rootSaga);

function Root(props) {
  useEffect(() => {
    props.checkLogin();
  }, []);

  const gdayPunchIssue =
    "https://gdaypunch-static.s3-us-west-2.amazonaws.com/compressed_gpmm-1-digital-compressed-s.pdf";
  const manga =
    "https://gdaypunch-static.s3-us-west-2.amazonaws.com/Escape.pdf";
  const orientation = "japanese";

  return (
    <Router history={history}>
      <Switch>
        <Route
          exact
          path="/gpmm/:id"
          component={() => (
            <Reader file={gdayPunchIssue} orientation={"english"} pageCount={104} readerOnly />
          )}
        />
        <Route path="/">
          <Navigation />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route
              exact
              path="/manga/:id"
              component={() => (
                <Reader file={manga} orientation={orientation} pageCount={4} />
              )}
            />
            {props.user.is_staff ? (
              <Switch>
                <Route exact path="/admin" component={Admin} />
                <Route exact path="/admin/:app" component={Admin} />
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
  user: selectUser
});

const mapDispatchToProps = {
  checkLogin: doCheckLogin
};

const RootContainer = connect(mapStateToProps, mapDispatchToProps)(Root);

function App() {
  return (
    <Provider store={store}>
      <RootContainer />
    </Provider>
  );
}

export default App;
