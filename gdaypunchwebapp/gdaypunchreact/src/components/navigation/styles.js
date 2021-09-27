import styled from "styled-components";
import { Link } from "react-router-dom";
import { device } from "utils/styles";

export const NavigationContainer = styled.div`
  background-color: #ffffff;
  min-height: 11.5vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  position: fixed;
  width: 100%;
  z-index: 10;
  transition: 0.2s ease;
  border-bottom: 1px #c7c7c7 solid;

  ${(props) =>
    props.$childNavOpen
      ? `
        padding-bottom: 3em;
        padding-top: 1em;
      `
      : ``}
`;

export const NavSection = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;

  p {
    margin: unset;
  }
`;

export const NavLogo = styled.img`
  width: 6em;
`;

export const NavLogoContainer = styled.div`
  margin-left: 1em;
`;

export const NavLinksMiddle = styled.div`
  display: ${(props) => (props.$open ? "flex" : "none")};
  justify-content: center;
  align-items: center;

  position: fixed;
  margin-top: ${(props) => (props.$scrolledMini ? "3.2em" : "4em")};
  flex-direction: column;
  width: 100%;

  @media ${device.laptop} {
    display: flex;
    width: max-content;
    position: inherit;
    margin-top: unset;
    flex-direction: row;
    width: unset;
  }
`;

export const NavDropDownButton = styled.div`
  display: flex;
  width: 70px;
  justify-content: center;
  align-items: center;

  @media ${device.laptop} {
    display: none;
  }

  svg {
    width: 2em;
    height: 2em;
  }

  &:hover {
    cursor: pointer;

    svg {
      width: 2.2em;
      height: 2.2em;
      transition-duration: 0.1s;
    }
  }
`;

export const NavLinksRight = styled.div`
  margin-right: 1em;
  width: min-content;
  display: none;
  justify-content: flex-end;
  align-items: center;

  @media ${device.laptop} {
    display: flex;
  }
`;

export const UserProfile = styled.p`
  color: #cecece;
`;

export const HeaderALink = styled.a`
  text-decoration: none;
  color: #565656;
  font-size: 1em;
  letter-spacing: 2pt;

  width: 100%;
  text-align: center;
  background: #f3f3f3;
  margin-left: unset;
  padding: 1em;
  border-bottom: 1px solid #d0d0d0;

  @media ${device.laptop} {
    width: unset;
    text-align: inherit;
    background: transparent;
    margin-left: 2em;
    padding: unset;
    border-bottom: unset;

    display: ${(props) => (props.$adminLink ? "none" : "inherit")};
  }

  &:hover {
    color: #ffbd46;
  }
`;

export const HeaderLink = styled(Link)`
  text-decoration: none;
  color: #565656;
  font-size: 1em;
  letter-spacing: 2pt;

  width: 100%;
  text-align: center;
  background: #f3f3f3;
  margin-left: unset;
  padding: 1em;
  border-bottom: 1px solid #d0d0d0;

  @media ${device.laptop} {
    width: unset;
    text-align: inherit;
    background: transparent;
    margin-left: 2em;
    padding: unset;
    border-bottom: unset;

    display: ${(props) => (props.$adminLink ? "none" : "inherit")};
  }

  ${(props) =>
    props.$showOnMiniNav
      ? `
      width: unset;
      text-align: inherit;
      background: transparent;
      margin-left: 2em;
      padding: unset;
      border-bottom: unset;
      transform: translate(0, 7pt);
    `
      : ``};

  &:hover {
    color: #ffbd46;
  }

  ${(props) =>
    props.$current
      ? `    
        color: #ffbd46;

        &:hover {
          color: #ffc864;
        }
      `
      : ``}

  .child-nav {
    display: none;
  }

  // Cart icon and number logic
  .site-form-item-icon {
    svg {
      width: ${(props) => (props.$showOnMiniNav ? "2.2em" : "1.5em")};
      height: ${(props) => (props.$showOnMiniNav ? "2.2em" : "1.5em")};
    }
  }
`;

export const HeaderParent = styled.span`
  text-decoration: none;
  color: #565656;
  font-size: 1em;
  letter-spacing: 2pt;
  white-space: nowrap;
  width: 100%;
  text-align: center;
  background: #f3f3f3;
  margin-left: unset;
  padding: 1em;
  border-bottom: 1px solid #d0d0d0;

  @media ${device.laptop} {
    width: unset;
    text-align: inherit;
    background: transparent;
    margin-left: 2em;
    padding: unset;
    border-bottom: unset;

    display: ${(props) => (props.$adminLink ? "none" : "inherit")};
  }

  ${(props) =>
    props.$showOnMiniNav
      ? `
    width: unset;
    text-align: inherit;
    background: transparent;
    margin-left: 2em;
    padding: unset;
    border-bottom: unset;
    transform: translate(0, 7pt);
  `
      : ``};

  &:hover {
    color: #ffbd46;
  }

  ${(props) =>
    props.$current
      ? `    
      color: #ffbd46;

      &:hover {
        color: #ffc864;
      }
    `
      : ``}

  .child-nav {
    display: none;
  }

  ${(props) =>
    props.$open
      ? `
        .child-nav {
          display: flex;
          position: absolute;
          margin-left: unset;
        }

        .first-child {
          border: none;
          background: none;
          justify-content: center;
          width: max-content;
          margin-left: auto;
          margin-right: auto;
          left: 0;
          right: 0;
          text-align: center;
          transform: translate(-5em, 0.4em);
        }

        .second-child {
          border: none;
          background: none;
          justify-content: center;
          width: max-content;
          margin-left: auto;
          margin-right: auto;
          left: 0;
          right: 0;
          text-align: center;
          transform: translate(4em, 0.4em);
        }

        height: 7em;

        @media ${device.laptop} {
          height: unset;

          .second-child {
            margin-left: unset;
            margin-right: unset;
            left: unset;
            right: unset;
            transform: translate(4em,2.4em);
          }

          .first-child {
            margin-left: unset;
            margin-right: unset;
            left: unset;
            right: unset;
            transform: translate(-5em,2.4em);
          }
        }
      `
      : ``}

  // Cart icon and number logic
  .site-form-item-icon {
    svg {
      width: ${(props) => (props.$showOnMiniNav ? "2.2em" : "1.5em")};
      height: ${(props) => (props.$showOnMiniNav ? "2.2em" : "1.5em")};
    }
  }
`;

export const CartNumber = styled.div`
  background: orange;
  color: white;
  border-radius: 14pt;
  width: 1.6em;
  text-align: center;
  padding-left: 1pt;
  transform: translate(-4pt, -8pt);

  &:hover {
    transform: ${(props) =>
      props.$showOnMiniNav ? "" : "translate(-4pt, -8pt) scale(1.1)"};
  }

  ${(props) =>
    props.$showOnMiniNav
      ? `
      transform: translate(-10pt,-19pt);
      display: inline-block;
      `
      : ``};
`;
