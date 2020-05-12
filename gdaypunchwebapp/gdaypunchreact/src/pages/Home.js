import React from "react";
import PropTypes from "prop-types";
import { Page, pdfjs } from "react-pdf";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { isEmpty } from "lodash";
import { Document } from "react-pdf/dist/entry.webpack";
import {
  doLogout,
  openRegistration,
  closeRegistration,
  doSuggestRegister
} from "actions/user";
import { doGetUserManga, doLikeManga } from "actions/manga";
import { selectLoginViewToggle, selectLoggedIn } from "selectors/app";
import { selectUserManga } from "selectors/manga";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "components/header";
import Login from "components/login";
import {
  faChevronCircleRight,
  faChevronCircleLeft,
  faSearchPlus,
  faSearchMinus,
  faHeart
} from "@fortawesome/free-solid-svg-icons";
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
      suggestRegister('Info: Sign up to continue reading "Escape"!');
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
      closeRegister,
      logout,
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

    console.log("userManga", userManga);

    return (
      <div id="top" className="App">
        <div className="App-header-container app-temp-background">
          <nav>
            {!loggedIn && (
              <a
                className="login-button"
                href="#"
                onClick={() => (loginView ? closeRegister() : openRegister())}
              >
                {loginView ? "Home" : "Login"}
              </a>
            )}
            {loggedIn && (
              <a href="#" style={styles.logout} onClick={() => logout()}>
                Logout
              </a>
            )}
          </nav>
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
                  suggestRegister("Info: Sign up to like this manga!");
                }
                if (!userManga[1].user_likes) {
                  likeManga(userManga[1].id);
                } else {
                  // unlikeManga(userManga[1].id);
                }
              }}
            >
              <FontAwesomeIcon
                icon={faHeart}
                style={!isEmpty(userManga) && userManga[1].user_likes ? { color: "red" } : null}
              />
              {`(${!isEmpty(userManga) ? userManga[1].likes : 0})`}
            </a>
          </div>
          <div style={styles.pdf}>
            <FontAwesomeIcon
              className="pdf-button"
              style={styles.pdfNavigator("left", nextDisabled)}
              icon={faChevronCircleLeft}
              onClick={() =>
                nextDisabled ? null : this.setPage(this.state.pageNumber + 1)
              }
            />
            <Document
              style={{
                width: `${readerSizeLevels[this.state.sizeLevel].container}%`
              }}
              file={Escape}
              className="pdf-container"
            >
              <Page
                pageNumber={this.state.pageNumber}
                width={readerSizeLevels[this.state.sizeLevel].page}
                object-fit="fill"
                size="A4"
              />
            </Document>
            <FontAwesomeIcon
              className="pdf-button"
              style={styles.pdfNavigator("right", prevDisabled)}
              icon={faChevronCircleRight}
              onClick={() =>
                prevDisabled ? null : this.setPage(this.state.pageNumber - 1)
              }
            />
            <FontAwesomeIcon
              className="pdf-button"
              style={styles.pdfMagnifier("left", false)}
              icon={faSearchMinus}
              onClick={() =>
                lowerDisabled ? null : this.setSize(this.state.sizeLevel - 1)
              }
            />
            <FontAwesomeIcon
              className="pdf-button"
              style={styles.pdfMagnifier("right", false)}
              icon={faSearchPlus}
              onClick={() =>
                higerDisabled ? null : this.setSize(this.state.sizeLevel + 1)
              }
            />
          </div>
        </div>
      </div>
    );
  }
}

function getStyles() {
  return {
    logout: {
      marginLeft: "2em"
    },
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
  logout: PropTypes.func.isRequired,
  openRegister: PropTypes.func.isRequired,
  suggestRegister: PropTypes.func.isRequired,
  closeRegister: PropTypes.func.isRequired,
  getUserManga: PropTypes.func.isRequired,
  likeManga: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  loggedIn: selectLoggedIn,
  loginView: selectLoginViewToggle,
  userManga: selectUserManga
});

const mapDispatchToProps = {
  logout: doLogout,
  openRegister: openRegistration,
  closeRegister: closeRegistration,
  suggestRegister: doSuggestRegister,
  getUserManga: doGetUserManga,
  likeManga: doLikeManga
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
