import React from "react";
import PropTypes from "prop-types";
import { Page, pdfjs } from "react-pdf";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Document } from "react-pdf/dist/entry.webpack";
import { doLogin } from "actions/user";
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
      <div className="App">
        <Header login={this.props.login} />
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
              className="App-header"
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
  login: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({});
const mapDispatchToProps = {
  login: doLogin
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
