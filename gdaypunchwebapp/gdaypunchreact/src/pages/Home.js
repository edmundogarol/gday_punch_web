import React, { useState } from "react";
import { Page, pdfjs } from "react-pdf";
import { Document } from "react-pdf/dist/entry.webpack";
import { getImageModule } from "utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPenNib,
  faBook,
  faChevronCircleRight,
  faChevronCircleLeft,
  faSearchPlus,
  faSearchMinus,
  faHeart
} from "@fortawesome/free-solid-svg-icons";
import Escape from "static/resources/Escape.pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function Home() {
  const [pageNumber, setPage] = useState(1);
  const [sizeLevel, setSize] = useState(0);

  const styles = getStyles();

  const prevDisabled = pageNumber === 1;
  const nextDisabled = pageNumber === 4;
  const lowerDisabled = sizeLevel === 0;
  const higerDisabled = sizeLevel === 2;

  console.log("sizeLevel", sizeLevel);

  const readerSizeLevels = [
    { container: "60", page: 500 },
    { container: "80", page: 750 },
    { container: "100", page: 1000 }
  ];

  return (
    <div className="App">
      <header className="App-header app-temp-background">
        <a href="https://www.gdaypunch.com">
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
      <div className="pdf-reader">
        <div className="pdf-details">
          <div>
            <h1>Escape</h1>
            <h4>by Edmundo Garol</h4>
          </div>
          <FontAwesomeIcon icon={faHeart} /> (0)
        </div>
        <div style={styles.pdf}>
          <FontAwesomeIcon
            className="pdf-button"
            style={styles.pdfNavigator("left", nextDisabled)}
            icon={faChevronCircleLeft}
            onClick={() => (nextDisabled ? null : setPage(pageNumber + 1))}
          />
          <Document
            style={{ width: `${readerSizeLevels[sizeLevel].container}%` }}
            file={Escape}
            className="App-header"
          >
            <Page
              pageNumber={pageNumber}
              width={readerSizeLevels[sizeLevel].page}
              object-fit="fill"
              size="A4"
            />
          </Document>
          <FontAwesomeIcon
            className="pdf-button"
            style={styles.pdfNavigator("right", prevDisabled)}
            icon={faChevronCircleRight}
            onClick={() => (prevDisabled ? null : setPage(pageNumber - 1))}
          />
          <FontAwesomeIcon
            className="pdf-button"
            style={styles.pdfMagnifier("left", false)}
            icon={faSearchMinus}
            onClick={() => (lowerDisabled ? null : setSize(sizeLevel - 1))}
          />
          <FontAwesomeIcon
            className="pdf-button"
            style={styles.pdfMagnifier("right", false)}
            icon={faSearchPlus}
            onClick={() => (higerDisabled ? null : setSize(sizeLevel + 1))}
          />
        </div>
      </div>
    </div>
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
