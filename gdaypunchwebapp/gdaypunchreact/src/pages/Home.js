import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { isEmpty } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart
} from "@fortawesome/free-solid-svg-icons";

import { openRegistration, doSuggestRegister } from "actions/user";
import { doGetUserManga, doLikeManga } from "actions/manga";

import { selectLoginViewToggle, selectLoggedIn } from "selectors/app";
import { selectUserManga } from "selectors/manga";

import Header from "components/header";
import Login from "components/login";
import MangaTile from "components/mangaTile";

import Escape from "static/resources/escape.png";
import GPMM1 from "static/resources/gpmm1.png";
import Tezuka from "static/resources/tezuka.png";

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    const { loggedIn, getUserManga } = this.props;

    if (!prevProps.loggedIn && loggedIn) {
      getUserManga();
    }
  }

  componentDidMount() {
    this.props.getUserManga();
  }

  clickManga(page) {
    const { loggedIn, openRegister, suggestRegister } = this.props;

    if (!loggedIn) {
      window.location.href = "/#top";
      openRegister();
      suggestRegister("Info: Sign up or Log in to continue reading!");
    } else {
    }
  }

  render() {
    const {
      loggedIn,
      loginView,
      openRegister,
      suggestRegister,
      userManga,
      likeManga
    } = this.props;
    const styles = getStyles();

    return (
      <div id="top" className="App">
        <div className="App-header-container app-temp-background">
          <Header loginView={loginView} />
          <Login />
        </div>
        <div style={styles.list}>
          <MangaTile cover={Escape} title="Escape" />
          <MangaTile cover={Tezuka} title="Thrones of Lore" />
        </div>
        {/* <div className="pdf-reader">
          <div className="pdf-details">
            <div>
              <h2>Escape</h2>
              <h4>by Edmundo Garol</h4>
            </div>
            <a
              onClick={() => {
                if (!loggedIn) {
                  window.location.href = "/#top";
                  openRegister();
                  suggestRegister(
                    "Info: Sign up or Log in to like this manga!"
                  );
                } else if (!userManga[1].user_likes) {
                  likeManga(userManga[1].id);
                } else {
                  // unlikeManga(userManga[1].id);
                }
              }}
            >
              <FontAwesomeIcon
                icon={faHeart}
                style={
                  !isEmpty(userManga) && userManga[1].user_likes
                    ? { color: "red" }
                    : null
                }
              />
              {`(${!isEmpty(userManga) ? userManga[1].likes : 0})`}
            </a>
          </div>
        </div> */}
      </div>
    );
  }
}

function getStyles() {
  return {
    list: {
      display: "flex",
      justifyContent: "center"
    }
  };
}

Home.propTypes = {
  // Redux Properties
  loggedIn: PropTypes.bool.isRequired,
  loginView: PropTypes.bool.isRequired,
  userManga: PropTypes.object,
  // Redux Functions
  openRegister: PropTypes.func.isRequired,
  suggestRegister: PropTypes.func.isRequired,
  getUserManga: PropTypes.func.isRequired,
  likeManga: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  loggedIn: selectLoggedIn,
  loginView: selectLoginViewToggle,
  userManga: selectUserManga
});

const mapDispatchToProps = {
  openRegister: openRegistration,
  suggestRegister: doSuggestRegister,
  getUserManga: doGetUserManga,
  likeManga: doLikeManga
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
