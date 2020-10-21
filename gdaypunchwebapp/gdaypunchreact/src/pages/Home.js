import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { isEmpty } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

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
          <MangaTile id="escape" cover={Escape} title="Escape" />
          <MangaTile id="thrones" cover={Tezuka} title="Thrones of Lore" />
        </div>
        <div style={styles.donateContainer}>
          <h3 style={styles.donateTitle}>Support Yungy's Manga</h3>
          <h5 style={styles.donateSubTitle}>So I can create bigger and better projects!</h5>
          <form
            action="https://www.paypal.com/donate"
            method="post"
            target="_top"
            style={styles.donate}
          >
            <input type="hidden" name="cmd" value="_donations" />
            <input
              type="hidden"
              name="business"
              value="edmundo.a.garol@outlook.com"
            />
            <input
              type="hidden"
              name="item_name"
              value="Supporting Yungy's Manga"
            />
            <input type="hidden" name="currency_code" value="USD" />
            <input
              type="image"
              src="https://www.paypalobjects.com/en_AU/i/btn/btn_donateCC_LG.gif"
              border="0"
              name="submit"
              title="PayPal - The safer, easier way to pay online!"
              alt="Donate with PayPal button"
            />
            <img
              alt=""
              border="0"
              src="https://www.paypal.com/en_AU/i/scr/pixel.gif"
              width="1"
              height="1"
            />
          </form>
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
    donate: {
      transform: "scale(1.5)"
    },
    donateContainer: {
      display: "flex",
      flexDirection: "column",
      height: "28vh"
    },
    donateTitle: {
      fontSize: "2em",
      marginBottom: "0.5em",
    },
    donateSubTitle: {
      fontSize: "1em",
      marginTop: "unset",
      marginBottom: "2.4em"
    },
    list: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap"
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
