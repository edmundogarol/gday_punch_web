import styled from "styled-components";
import { device } from "utils/styles";

export const AdminContainer = styled.div`
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: scroll;

  @media ${device.laptop} {
    flex-direction: row;
  }

  .desktop-mobile,
  .mobile-only:not(.anticon) {
    height: unset;
    flex-direction: column;
    padding: 1em;
  }

  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: flex;
  }

  @media ${device.laptop} {
    .desktop-mobile {
      padding: unset;
      height: 3em;
    }

    .desktop-only {
      display: flex;
    }

    .mobile-only {
      display: none;
    }
  }
`;

export const AdminNav = styled.div`
  width: 100%;
  padding-top: 11vh;
  background: #f1f1f1;
  display: flex;
  flex-direction: row;

  a {
    width: 100%;
    height: 3em;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: #333333;
    background: #d0d0d0;
    font-size: 1em;
  }

  a:hover {
    color: #f9f9f9;
    background: #6b6b6b;
  }

  .active {
    background: #ec9900;
    color: white;
    font-weight: 500;
  }

  @media ${device.laptop} {
    width: 30vh;
    flex-direction: column;
  }
`;

export const AdminContentContainer = styled.div`
  width: 100%;
  padding: 2em;
  padding-top: 12vh;
`;
