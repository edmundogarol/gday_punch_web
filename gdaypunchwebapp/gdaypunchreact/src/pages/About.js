import React, { useEffect } from "react";
import styled from "styled-components";
import AboutSection from "components/about";

export const App = styled.div`
  .App-header-container {
    min-height: 56vh;
  }
`;

function About(props) {
  return (
    <App id="top" className="App">
      <AboutSection top />
    </App>
  );
}

export default About;
