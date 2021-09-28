import styled from "styled-components";
import { Button } from "antd";
import { device } from "utils/styles";
import { ErrorField } from "components/errorField";

export const App = styled.div`
  min-height: 84vh;

  ${ErrorField} {
    font-size: 0.9em;
  }
`;

export const RequiredField = styled.span`
  color: red;
  margin-left: 0.5em;
`;

export const SubscribeButton = styled(Button)`
  border: none;
  height: 3em;
  background: #f3b600;

  &:hover {
    background: dimgrey;

    span {
      color: white;
    }
  }

  &:active,
  &:focus {
    border: 1px solid dimgrey;
    span {
      color: dimgray;
    }

    &:hover {
      span {
        color: white;
      }
    }
  }
`;

export const SubscribeText = styled.span`
  color: white;
`;

export const DownloadItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  flex-wrap: wrap;
  margin-right: 2em;
  margin-left: 2em;
  justify-content: center;
  margin-top: 1em;
  margin-bottom: 2em;

  input {
    margin-bottom: 1em;
  }

  .ant-image {
    border: 1px solid #cecece;
    padding: 1em;
    border-radius: 0.4em;

    @media ${device.laptop} {
      width: 25em;
    }
  }

  h2,
  span:not(${RequiredField}):not(${SubscribeText}) {
    color: #505050;
  }
`;

export const SubscribeContainer = styled.div`
  text-align: start;
  padding: 1em;
  width: 100%;
  display: flex;
  flex-direction: column;

  @media ${device.mobileL} {
    width: 54%;
    min-width: 30em;
  }
`;

export const SuccessLabel = styled.label`
  color: #4fbf4f;
  background: #deffde;
  padding: 0.7em;
  border-radius: 4pt;
`;
