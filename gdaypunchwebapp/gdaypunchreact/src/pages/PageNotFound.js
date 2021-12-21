import React from "react";
import { useScrollTop } from "utils/hooks/useScrollTop";
import { getResourceImage } from "utils/utils";
import styled from "styled-components";
import { device } from "utils/styles";

export const HeaderContainer = styled.div`
  background-color: #f1f1f1;
  min-height: 84vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  grid-column-start: 2;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 1;
  position: relative;
  background-image: ${(props) =>
    `url(${props.background || "/static/launch-background.png"})`};
  background-position: center;
  background-size: 136%;
  background-blend-mode: ${(props) =>
    props.background ? "unset" : "color-burn"};

  @media ${device.laptop} {
    background-size: 88%;
  }
`;

export default function PageNotFound() {
  useScrollTop();

  return (
    <HeaderContainer className="page-not-found">
      <a className="home-logo" href="https://www.gdaypunch.com.au">
        <img
          src={getResourceImage("gday.png")}
          className="App-logo"
          alt="Gday Punch Logo"
        />
      </a>
      {"404 Woops, that page doesn't exist!"}
    </HeaderContainer>
  );
}
