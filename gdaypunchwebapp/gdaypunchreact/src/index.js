import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<App />, document.getElementById("root"));

console.log(module.hot);
if (module.hot) {
  console.log("Hot and accepting App.js");
  module.hot.accept("./App.js", function () {
    console.log("Accepting the updated App module!");
  });
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
