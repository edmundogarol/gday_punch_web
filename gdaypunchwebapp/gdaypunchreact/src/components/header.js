import React from "react";
import PropTypes from "prop-types";
import { getImageModule } from "utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPenNib, faBook } from "@fortawesome/free-solid-svg-icons";

export default function Header(props) {
  const { login } = props;
  const styles = getStyles();

  return (
    <header className="App-header app-temp-background">
      <nav>
        <a
          href="#"
          onClick={() => login({ username: "admin", password: "password" })}
        >
          Login
        </a>
      </nav>
      <a className="home-logo" href="https://www.gdaypunch.com">
        <img
          src={getImageModule("gday_big.png")}
          className="App-logo-big"
          alt="Gday Punch Logo Big"
        />
        <img
          src={getImageModule("gday.png")}
          className="App-logo"
          alt="Gday Punch Logo"
        />
      </a>
      <p>New Web App Launching in December 2020!</p>
      <div className="feature-content">
        <div className="feature">
          <FontAwesomeIcon icon={faPenNib} style={styles.mangaka} />
          <h2>Mangaka</h2>
        </div>
        <div className="feature">
          <FontAwesomeIcon icon={faBook} style={styles.readers} />
          <h2>Readers</h2>
        </div>
        <div className="feature">
          <FontAwesomeIcon icon={faEye} style={styles.editors} />
          <h2>Editors</h2>
        </div>
      </div>
    </header>
  );
}

function getStyles() {
  return {
    mangaka: {
      color: "#bbbb21",
      filter: "saturate(0.5)"
    },
    readers: {
      color: "#bb5c26",
      filter: "saturate(0.5)"
    },
    editors: {
      color: "#b83027",
      filter: "saturate(0.5)"
    }
  };
}

Header.propTypes = {
  // Redux Properties
  login: PropTypes.func.isRequired
};
