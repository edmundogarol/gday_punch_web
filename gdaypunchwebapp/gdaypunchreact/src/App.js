import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import "./App.scss";

function App() {
  const styles = getStyles();

  return (
    <Router>
      <div>
        <nav style={{ display: "none" }}>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/about"></Route>
          <Route path="/users"></Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function getStyles() {
  return {};
}

export default App;
