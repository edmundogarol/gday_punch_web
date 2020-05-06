import React from "react";
import PropTypes from "prop-types";
import { Page, pdfjs } from "react-pdf";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Document } from "react-pdf/dist/entry.webpack";
import {
  doRegistration,
  openRegistration,
  closeRegistration
} from "actions/user";
import { selectRegisterationToggle } from "selectors/app";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "components/header";
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

  setPage(page) {
    this.setState({
      pageNumber: page
    });
  }

  setSize(page) {
    this.setState({
      sizeLevel: page
    });
  }

  render() {
    const {
      registrationToggle,
      openRegister,
      closeRegister,
      register
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

    console.log("Registering", registrationToggle);

    return (
      <div className="App">
        <div className="App-header-container app-temp-background">
          <nav>
            <a
              href="#"
              onClick={() =>
                registrationToggle ? closeRegister() : openRegister()
              }
            >
              {registrationToggle ? "Home" : "Login"}
            </a>
          </nav>
          <Header registrationOpen={registrationToggle} />
          <div className={`registration ${registrationToggle ? "show" : ""}`}>
            <div className="registration-inputs">
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input type="text" name="email" />
              </div>
              <div className="input-group">
                <label htmlFor="email">Password</label>
                <input type="password" name="password" />
              </div>
            </div>
            <div className="account-buttons">
              <button
                onClick={() =>
                  register({ username: "admin", password: "gdaypassword" })
                }
                className="sign-up-button"
                type="submit"
              >
                Sign Up
              </button>
              <span></span>
              <button
                onClick={() =>
                  register({ username: "admin", password: "gdaypassword" })
                }
                className="sign-up-button"
                type="submit"
              >
                Login
              </button>
            </div>
          </div>
        </div>
        <div className="pdf-reader">
          <div className="pdf-details">
            <div>
              <h2>Escape</h2>
              <h4>by Edmundo Garol</h4>
            </div>
            <FontAwesomeIcon icon={faHeart} /> (0)
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
  registrationToggle: PropTypes.bool.isRequired,
  // Redux Functions
  register: PropTypes.func.isRequired,
  openRegister: PropTypes.func.isRequired,
  closeRegister: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  registrationToggle: selectRegisterationToggle
});
const mapDispatchToProps = {
  register: doRegistration,
  openRegister: openRegistration,
  closeRegister: closeRegistration
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
