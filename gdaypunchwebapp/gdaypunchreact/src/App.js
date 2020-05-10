import React, { useEffect } from "react";
import { Provider, connect } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createStore, applyMiddleware, compose } from "redux";
import { createStructuredSelector } from "reselect";
import createSagaMiddleware from "redux-saga";
import appReducer from "reducers/app";
import appSaga from "sagas/app";
import { doCheckLogin } from "actions/user";

import Home from "pages/Home";
import "./App.scss";

/**
 * Set up and run app sagas listening for events
 */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  appReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);
sagaMiddleware.run(appSaga);

function Root(props) {
  useEffect(() => {
    props.checkLogin();
  });

  return (
    <Router history={history}>
      <Route exact path="/" component={Home} />
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
