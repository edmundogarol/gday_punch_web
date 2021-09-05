import { FeaturedChildrenContainer } from "src/components/featuredSection";
import styled from "styled-components";
import { device } from "utils/styles";

export const App = styled.div`
  min-height: 84vh;

  .ant-tabs {
    width: 100%;

    @media ${device.laptop} {
      width: 50em;
    }
  }

  ${FeaturedChildrenContainer} {
    width: 90%;

    @media ${device.laptop} {
      width: unset;
    }
  }
`;

export const ContactForm = styled.div`
  height: 480pt;
  width: 100%;
  justify-content: space-evenly;
  display: flex;
  flex-direction: column;
  text-align: start;
  margin-bottom: 2em;

  @media ${device.laptop} {
    width: 24em;
  }

  .ant-select {
    text-align: start;
    width: 100%;
    margin-bottom: 1em;
  }

  label {
    font-size: 1.2em;
  }

  button {
    margin-top: 1em;
    background: #f7b757;
    border: none;
    color: white;
    height: 3em;
    text-transform: uppercase;
    letter-spacing: 1pt;
    border-radius: 3pt;

    &:hover {
      background: #eaac4e;
      color: white;
    }
  }
`;

export const RequiredField = styled.span`
  color: red;
  margin-left: 0.5em;
`;

export const ContactImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  flex-wrap: wrap;
  margin-right: 2em;
  margin-left: 2em;
  justify-content: center;

  img {
    height: fit-content;
  }
`;

export const SuccessLabel = styled.label`
  color: #4fbf4f;
  background: #deffde;
  padding: 0.7em;
  border-radius: 4pt;
`;
