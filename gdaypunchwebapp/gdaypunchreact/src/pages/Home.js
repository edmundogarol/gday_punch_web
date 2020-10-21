import React from "react";
import PropTypes from "prop-types";
import { Page, pdfjs } from "react-pdf";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { isEmpty } from "lodash";
import { Document } from "react-pdf/dist/entry.webpack";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleRight,
  faChevronCircleLeft,
  faSearchPlus,
  faSearchMinus,
  faHeart
} from "@fortawesome/free-solid-svg-icons";

import { openRegistration, doSuggestRegister } from "actions/user";
import { doGetUserManga, doLikeManga } from "actions/manga";

import { selectLoginViewToggle, selectLoggedIn } from "selectors/app";
import { selectUserManga } from "selectors/manga";

import Header from "components/header";
import Login from "components/login";

import Reader from "./Reader";

import Escape from "static/resources/Escape.pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 1,
      sizeLevel: 0
    };
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

  setPage(page) {
    const { loggedIn, openRegister, suggestRegister } = this.props;

    if (!loggedIn) {
      window.location.href = "/#top";
      openRegister();
      suggestRegister("Info: Sign up or Log in to continue reading!");
    } else {
      this.setState({
        pageNumber: page
      });
    }
  }

  setSize(page) {
    this.setState({
      sizeLevel: page
    });
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

    const prevDisabled = this.state.pageNumber === 1;
    const nextDisabled = this.state.pageNumber === 4;
    const lowerDisabled = this.state.sizeLevel === 0;
    const higerDisabled = this.state.sizeLevel === 2;

    const readerSizeLevels = [
      { container: "60", page: 500 },
      { container: "80", page: 750 },
      { container: "100", page: 1000 }
    ];

    return (
      <div id="top" className="App">
        <div className="App-header-container app-temp-background">
          <Header loginView={loginView} />
          <Login />
        </div>
        <div className="pdf-reader">
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
          <Reader />
        </div>
      </div>
    );
  }
}

function getStyles() {
  return {
    pdf: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      position: "relative",
      paddingBottom: 50
    },
    pdfMagnifier: (position, disabled) => ({
      position: "absolute",
      bottom: 0,
      height: "4em",
      width: "4em",
      opacity: disabled ? "0" : "0.3",
      transform: position === "left" ? "translateX(-40px)" : "translateX(40px)"
    }),
    pdfNavigator: (position, disabled) => ({
      left: position === "left" ? 0 : "unset",
      right: position === "right" ? 0 : "unset",
      opacity: disabled ? "0" : "0.3",
      position: "absolute",
      zIndex: 1,
      height: "4em",
      width: "4em"
    })
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
