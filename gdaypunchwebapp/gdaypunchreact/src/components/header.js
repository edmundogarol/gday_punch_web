import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { EditOutlined } from "@ant-design/icons";

import LoadingSpinner from "components/loadingSpinner";
import { selectLoginViewToggle, selectNavMinified } from "selectors/app";
import { UserAvatarComponent } from "./UserAvatar";
import { device } from "utils/styles";
import { getResourceImage } from "utils/utils";

export const Overlay = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: white;
  opacity: 0.5;
  display: none;
`;

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
  position: relative;

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

  ${(props) =>
    props.background
      ? `
        background-repeat: no-repeat;
        background-size: cover;
        background-position-y: 4.3em;

        @media ${device.laptop} {
          background-position-y: ${props.navMinified ? "4.3em" : "5.3em"};
          background-size: cover;
        }

        ${UserAvatarComponent} {
          border: 0.4em solid white;
          border-radius: 7em;
          position: absolute;

          width: 12em;
          height: 12em;
          left: 9em;
          top: 11em;

          @media ${device.mobileM} {
            border-radius: 5em;
            width: 9em;
            height: 9em;
            left: 5em;
            top: 16em;
          }
        }
      `
      : ""}

  ${(props) =>
    props.currloading
      ? `
        ${Overlay} {
          display: initial;
        }
        `
      : ""}

  ${(props) =>
    props.overlay
      ? `
        &:hover {
          // ${Overlay} {
          //   display: initial;
          // }

          .cover-uploader {
            .anticon-edit, .anticon-save, .anticon-delete, .anticon-close  {
              path {
                fill: white;
                stroke: dimgrey;
                stroke-width: 2em;
                stroke-linejoin: round;
              }
            }
          }
        }
  
        `
      : ""}

  .anticon {
    z-index: 2;
    position: absolute;
    right: 1em;
    bottom: 1em;

    svg {
      height: 2em;
      width: 2em;
      color: #343434;
    }

    &:hover {
      cursor: pointer;
    }
  }

  .anticon-save,
  .anticon-delete {
    right: 4em;
  }

  ${(props) =>
    props.editing
      ? `
      .anticon-delete {
        right: 7em;
      }
    `
      : ""}

  .ant-spin-dot {
    z-index: 2;
    position: absolute;
    right: unset;
    top: 50%;

    svg {
      height: 3em;
      width: 3em;
    }
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
  const { children, background, editable, loading, editing } = props;
  const navMinified = useSelector(selectNavMinified);
  const loginView = useSelector(selectLoginViewToggle);

  return (
    <HeaderContainer
      editing={editing}
      currloading={loading}
      background={background}
      navMinified={navMinified}
      overlay={editable}
    >
      {editable && <Overlay />}
      {loading && <LoadingSpinner />}
      {editable}
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
