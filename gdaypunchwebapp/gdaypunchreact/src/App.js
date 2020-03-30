import React from "react";
import { getImageModule } from "./utils/utils";
import "./App.scss";

function App() {
  const styles = getStyles();

  return (
    <div className="App">
      <header className="App-header app-temp-background">
        <img
          src={getImageModule("gday.png")}
          className="App-logo"
          alt="Gday Punch Logo"
        />
        <h1>Gday Punch Manga Magazine</h1>
        <p>Launching December 2020!</p>
      </header>
    </div>
  );
}

function getStyles() {
  return {
  }
}

export default App;
