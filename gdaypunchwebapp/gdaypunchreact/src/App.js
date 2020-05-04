import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import appReducer from "reducers/app";
import appSaga from "sagas/app";

import Home from "pages/Home";
import "./App.scss";

/**
 * Set up and run app sagas listening for events
 */
const sagaMiddleware = createSagaMiddleware();
const store = createStore(appReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(appSaga);

function App() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Route exact path="/" component={Home} />
        {/* <Route path="/book/:id/" component={BookDetail} /> */}
      </Router>
    </Provider>
  );
}

export default App;
