import React from "react";
import { getResourceImage } from "utils/utils";
import styled from "styled-components";
import { device } from "utils/styles";
import { useSelector } from "react-redux";
import { selectLoginViewToggle } from "selectors/app";

export const HeaderContainer = styled.div`
  background-color: #f1f1f1;
  min-height: 55vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(5px + 2vmin);
  color: rgb(179, 179, 179);
  grid-column-start: 2;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 1;

  height: 100%;
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
export const HomeHeroLogo = styled.div`
  align-items: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: absolute;
  animation: 0.6s ease-in 0s 1 slideInFromLeft;
  padding-top: 3em;
`;

export default function Header(props) {
  const { children, background } = props;
  const loginView = useSelector(selectLoginViewToggle);

  return (
    <HeaderContainer background={background}>
      {background ? (
        children
      ) : (
        <>
          <HomeHeroLogo className={loginView ? "exit" : ""}>
            <a className="home-logo" href="https://www.gdaypunch.com.au">
              <img
                src={getResourceImage("gday_big.png")}
                className="App-logo-big"
                alt="Gday Punch Logo Big"
              />
              <img
                src={getResourceImage("gday.png")}
                className="App-logo"
                alt="Gday Punch Logo"
              />
            </a>
          </HomeHeroLogo>
          {children}
        </>
      )}
    </HeaderContainer>
  );
}
