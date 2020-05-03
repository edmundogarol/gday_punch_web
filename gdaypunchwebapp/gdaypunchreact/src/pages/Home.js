import React from "react";
import { Page, pdfjs } from "react-pdf";
import { Document } from "react-pdf/dist/entry.webpack";
import { getImageModule } from "utils/utils";
import Escape from "static/resources/Escape.pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function Home() {
  return (
    <div className="App">
      <header className="App-header app-temp-background">
        <img
          src={getImageModule("gday.png")}
          className="App-logo"
          alt="Gday Punch Logo"
        />
        <h1>Gday Punch Manga Magazine</h1>
        <p>Launching December 2020!</p>
      </header>
      <Document file={Escape}>
        <Page pageNumber={1} />
      </Document>
    </div>
  );
}
