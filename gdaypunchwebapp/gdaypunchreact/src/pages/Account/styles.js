import { FeaturedChildrenContainer } from "src/components/featuredSection";
import styled from "styled-components";
import { device } from "utils/styles";
import { Button } from "antd";
import { ErrorField } from "components/errorField";

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

  ${ErrorField} {
    font-size: 1em;
  }

  .ant-tabs-content {
    text-align: start;
  }

  .non-first-tab {
    margin-top: 1em;
  }

  .ant-card-extra {
    display: flex;

    .disabled {
      color: rgba(0, 0, 0, 0.25);

      &:hover {
        opacity: 1 !important;
      }
    }
  }

  .ant-card-body {
    .spinner {
      margin-left: 50%;
    }
  }
`;

export const DetailField = styled.div`
  display: grid;
  grid-template-columns: 9.1em auto 1fr 1fr;
  text-align: start;
  column-gap: 16px;

  ${(props) =>
    props.noLabel
      ? `
      grid-template-columns: 50% auto 1fr;
  `
      : ""}

  .unset {
    color: #b7b7b7;
  }

  .error {
    color: #ff5656;
    text-align: end;
  }

  div {
    display: flex;
    justify-content: flex-end;
  }
`;

export const EditButton = styled(Button)`
  width: min-content;
  background: transparent;
  border: none;
  justify-self: end;
  padding: unset;
  color: dimgray;
  height: min-content;
  box-shadow: unset;
  -webkit-box-shadow: unset;
  border-radius: unset;

  ${(props) =>
    props.separator
      ? `
    padding-right: 0.5em;
    border-right: 1px solid #b7b7b7;
    margin-right: 0.5em;
    `
      : ""}

  &:active, :hover, :visited, :focus {
    color: dimgray;
    background: transparent;
    border: none;

    ${(props) =>
      props.separator
        ? `
      border-right: 1px solid #b7b7b7;
      `
        : ""}
  }
`;

export const SuccessLabel = styled.label`
  color: #4fbf4f;
  background: #deffde;
  padding: 0.7em;
  border-radius: 4pt;
`;
