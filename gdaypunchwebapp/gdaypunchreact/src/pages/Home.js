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
  faChevronCircleLeft
} from "@fortawesome/free-solid-svg-icons";
import Escape from "static/resources/Escape.pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function Home() {
  const [pageNumber, setPage] = useState(1);
  const styles = getStyles();

  const prevDisabled = pageNumber === 1;
  const nextDisabled = pageNumber === 4;

  return (
    <div className="App">
      <header className="App-header app-temp-background">
        <img
          src={getImageModule("gday.png")}
          className="App-logo"
          alt="Gday Punch Logo"
        />
        <img
          src={getImageModule("gday_big.png")}
          className="App-logo-big"
          alt="Gday Punch Logo Big"
        />
        <p>Launching December 2020!</p>
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
      <div style={styles.pdf}>
        <FontAwesomeIcon
          style={styles.pdfButton(prevDisabled)}
          icon={faChevronCircleLeft}
          onClick={() => (prevDisabled ? null : setPage(pageNumber - 1))}
        />
        <Document
          file={Escape}
          height={"100%"}
          scale={1}
          className="App-header"
        >
          <Page pageNumber={pageNumber} />
        </Document>
        <FontAwesomeIcon
          style={styles.pdfButton(nextDisabled)}
          icon={faChevronCircleRight}
          onClick={() => (nextDisabled ? null : setPage(pageNumber + 1))}
        />
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
      padding: 50
    },
    pdfButton: (disabled) => ({
      height: "4em",
      width: "4em",
      opacity: disabled ? "0.2" : "0.8"
    })
  };
}
