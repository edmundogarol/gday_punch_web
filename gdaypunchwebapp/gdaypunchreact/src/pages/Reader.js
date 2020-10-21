import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Page, pdfjs } from "react-pdf";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
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

function Reader(props) {
  const { file, orientation, getGPManga, readerOnly, pageCount } = props;
  const [pageNumber, setPageNumber] = useState(1);
  const [sizeLevel, setSizeLevel] = useState(0);
  const { id } = useParams();
  const mangaId = id;

  const styles = getStyles();

  const japaneseReading = orientation === "japanese";
  const firstPage = pageNumber === 1;
  const lastPage = pageNumber === pageCount;
  const leftNavigatorDisabled = japaneseReading ? lastPage : firstPage;
  const rightNavigatorDisabled = japaneseReading ? firstPage : lastPage;
  const lowerDisabled = sizeLevel === 0;
  const higerDisabled = sizeLevel === 2;

  const readerSizeLevels = [
    { container: "60", page: 500 },
    { container: "80", page: 750 },
    { container: "100", page: 1000 }
  ];

  useEffect(() => {
    getGPManga();
  });

  return (
    <div
      className={classNames("pdf-reader", {
        "reader-only": readerOnly
      })}
    >
      <div style={styles.pdf}>
        <FontAwesomeIcon
          className={classNames("pdf-button", {
            disabled: leftNavigatorDisabled
          })}
          style={styles.pdfNavigator("left", leftNavigatorDisabled)}
          icon={faChevronCircleLeft}
          onClick={() =>
            leftNavigatorDisabled
              ? null
              : setPageNumber(japaneseReading ? pageNumber + 1 : pageNumber - 1)
          }
        />
        <Document
          style={{
            width: `${readerSizeLevels[sizeLevel].container}%`
          }}
          file={file}
          className="pdf-container"
          options={{
            rangeChunkSize: 2000000
          }}
        >
          <Page
            loading={"Hang on! Loading page..."}
            pageNumber={pageNumber}
            width={readerSizeLevels[sizeLevel].page}
            object-fit="fill"
            onRenderSuccess={null}
            size="A4"
          />
        </Document>
        <FontAwesomeIcon
          className={classNames("pdf-button", {
            disabled: rightNavigatorDisabled
          })}
          style={styles.pdfNavigator("right", rightNavigatorDisabled)}
          icon={faChevronCircleRight}
          onClick={() =>
            rightNavigatorDisabled
              ? null
              : setPageNumber(japaneseReading ? pageNumber - 1 : pageNumber + 1)
          }
        />
        <FontAwesomeIcon
          className="pdf-button"
          style={styles.pdfMagnifier("left", false)}
          icon={faSearchMinus}
          onClick={() => (lowerDisabled ? null : setSizeLevel(sizeLevel - 1))}
        />
        <FontAwesomeIcon
          className="pdf-button"
          style={styles.pdfMagnifier("right", false)}
          icon={faSearchPlus}
          onClick={() => (higerDisabled ? null : setSizeLevel(sizeLevel + 1))}
        />
      </div>
    </div>
  );
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
      gridTemplateRows: "auto 100px"
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
      justifySelf: "center"
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
      justifySelf: "center"
    })
  };
}

Reader.propTypes = {
  // Component Properites
  file: PropTypes.string,
  orientation: PropTypes.string,
  readerOnly: PropTypes.bool,
  pageCount: PropTypes.number,
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
