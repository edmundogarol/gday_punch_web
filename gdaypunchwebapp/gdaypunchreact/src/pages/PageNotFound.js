import React from "react";
import { getImageModule } from "utils/utils";

export default function PageNotFound() {
  return (
    <div id="top" className="App">
      <div className="App-header-container app-temp-background page-not-found">
        <a className="home-logo" href="https://www.gdaypunch.com">
          <img
            src={getImageModule("gday.png")}
            className="App-logo"
            alt="Gday Punch Logo"
          />
        </a>
        {"404 Woops, that page doesn't exist!"}
      </div>
    </div>
  );
}
