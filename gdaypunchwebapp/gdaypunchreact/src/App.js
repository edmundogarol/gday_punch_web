import React, { useEffect } from "react";
import { Provider, connect } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createStore, applyMiddleware, compose } from "redux";
import { createStructuredSelector } from "reselect";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";
import appReducer from "reducers/app";
import appSaga from "sagas/app";
import mangaSaga from "sagas/manga";
import { doCheckLogin } from "actions/user";

import Home from "pages/Home";
import PageNotFound from "pages/PageNotFound";
import "./App.scss";

/**
 * Set up and run app sagas listening for events
 */
function* rootSaga() {
  yield all([appSaga(), mangaSaga()]);
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
  });

  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route component={PageNotFound} />
      </Switch>
    </Router>
  );
}

const mapStateToProps = createStructuredSelector({});

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
