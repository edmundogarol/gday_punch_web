import React from "react";
import PropTypes from "prop-types";
import { Page, pdfjs } from "react-pdf";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Document } from "react-pdf/dist/entry.webpack";
import { openRegistration, doSuggestRegister } from "actions/user";
import { doGetGPManga } from "actions/manga";
import { selectLoginViewToggle, selectLoggedIn } from "selectors/app";
import { selectUserManga, selectGPManga } from "selectors/manga";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleRight,
  faChevronCircleLeft,
  faSearchPlus,
  faSearchMinus
} from "@fortawesome/free-solid-svg-icons";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class Reader extends React.Component {
  constructor(props) {
    super(props);
    console.log("props.file", props.file);

    this.state = {
      file: props.file,
      pageNumber: 1,
      sizeLevel: 0
    };
  }

  componentDidMount() {
    this.props.getGPManga();
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
    const { gpManga } = this.props;
    const styles = getStyles();

    const prevDisabled = this.state.pageNumber === 1;
    const nextDisabled = this.state.pageNumber === 100;
    const lowerDisabled = this.state.sizeLevel === 0;
    const higerDisabled = this.state.sizeLevel === 2;

    const readerSizeLevels = [
      { container: "60", page: 500 },
      { container: "80", page: 750 },
      { container: "100", page: 1000 }
    ];

    return (
      <div className="pdf-reader">
        <div style={styles.pdf}>
          <FontAwesomeIcon
            className="pdf-button"
            style={styles.pdfNavigator("left", prevDisabled)}
            icon={faChevronCircleLeft}
            onClick={() =>
              prevDisabled ? null : this.setPage(this.state.pageNumber - 1)
            }
          />
          <Document
            style={{
              width: `${readerSizeLevels[this.state.sizeLevel].container}%`
            }}
            // file={gpManga}
            file={
              "https://gdaypunch-static.s3-us-west-2.amazonaws.com/compressed_gpmm-1-digital-compressed-s.pdf"
            }
            className="pdf-container"
            options={{
              rangeChunkSize: 2000000
            }}
          >
            <Page
              loading={"Hang on! Loading page..."}
              pageNumber={this.state.pageNumber}
              width={readerSizeLevels[this.state.sizeLevel].page}
              object-fit="fill"
              onRenderSuccess={null}
              size="A4"
            />
          </Document>
          <FontAwesomeIcon
            className="pdf-button"
            style={styles.pdfNavigator("right", nextDisabled)}
            icon={faChevronCircleRight}
            onClick={() =>
              nextDisabled ? null : this.setPage(this.state.pageNumber + 1)
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
    );
  }
}

function getStyles() {
  return {
    pdf: {
      display: "grid",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      position: "relative",
      paddingBottom: 50,
      gridTemplateColumns: "50px auto 50px",
      gridTemplateRows: "auto 100px",
    },
    pdfMagnifier: (position, disabled) => ({
      bottom: 0,
      height: "4em",
      width: "4em",
      opacity: disabled ? "0" : "0.3",
      transform: position === "left" ? "translateX(-40px)" : "translateX(40px)",
      gridColumnStart: 2,
      gridColumnEnd: 2,
      gridRowStart: 2,
      gridRowEnd: 2,
      justifySelf: "center",
    }),
    pdfNavigator: (position, disabled) => ({
      position: "relative",
      opacity: disabled ? "0" : "0.3",
      zIndex: 1,
      height: "4em",
      width: "4em",
      gridColumnStart: position === "left" ? 0 : 3,
      gridColumnEnd: position === "left" ? 0 : 3,
      gridRowStart: 1,
      gridRowEnd: 1,
      justifySelf: "center",
    })
  };
}

Reader.propTypes = {
  // Component Properites
  file: PropTypes.string,
  // Redux Properties
  gpManga: PropTypes.object,
  loggedIn: PropTypes.bool.isRequired,
  loginView: PropTypes.bool.isRequired,
  userManga: PropTypes.object,
  // Redux Functions
  openRegister: PropTypes.func.isRequired,
  suggestRegister: PropTypes.func.isRequired,
  getGPManga: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  gpManga: selectGPManga,
  loggedIn: selectLoggedIn,
  loginView: selectLoginViewToggle,
  userManga: selectUserManga
});

const mapDispatchToProps = {
  openRegister: openRegistration,
  suggestRegister: doSuggestRegister,
  getGPManga: doGetGPManga
};

export default connect(mapStateToProps, mapDispatchToProps)(Reader);
