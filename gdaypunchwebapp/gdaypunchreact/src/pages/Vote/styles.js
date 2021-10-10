import styled from "styled-components";
import { device } from "utils/styles";
import { Button } from "antd";

export const App = styled.div`
  min-height: 84vh;

  .ant-radio-group {
    display: flex;
    flex-direction: column;
    /* align-items: start; */
    width: 100%;
    align-items: center;

    .ant-radio-wrapper {
      padding: 1em;
    }
  }

  .disable {
    color: #b7b7b7;
  }
`;

export const PurchaseReasonContainer = styled.div`
  display: flex;
  margin-bottom: 1em;
  flex-wrap: wrap;

  @media ${device.laptop} {
    flex-wrap: unset;
  }
`;

export const SuccessLabel = styled.label`
  color: #4fbf4f;
  background: #deffde;
  padding: 0.7em;
  border-radius: 4pt;
`;

export const VotingItemImage = styled.div`
  background-image: url(${(props) => props.src});
  height: 20em;
  width: 15em;
  background-size: cover;
  margin: 0.2em;

  ${(props) =>
    props.disabled
      ? ""
      : `
      &:hover {
        cursor: pointer;
        opacity: 1 !important;
      }
      `}
`;

export const DisabledOverlay = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0000007a;
  color: white;
  font-size: 3em;
  font-weight: 200;
`;

export const VotingItemsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 47em;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 2em;
  position: relative;
  justify-content: center;

  .position-overlay {
    display: none;
  }

  ${(props) =>
    props.disabled
      ? ""
      : `
      ${
        props.active
          ? `
            ${VotingItemImage}:not(.selected) {
              opacity: 0.5;
            }
            `
          : ""
      }

      &:hover {
        ${VotingItemImage}:not(.selected) {
          opacity: 0.5;
        }
      }
  `}

  .selected {
    position: relative;
    opacity: 1;
    transform: scale(1.05);

    .position-overlay {
      display: initial;
      position: absolute;
      font-size: 9em;
      z-index: 1;
      left: 0;
      right: 0;
      font-weight: 900;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .casting-1 {
    .position-overlay {
      color: gold;
      background: radial-gradient(gold -114%, transparent);
      text-shadow: -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff,
        2px 2px 0 #fff;
    }
  }
  .casting-2 {
    .position-overlay {
      color: silver;
      background: radial-gradient(silver -114%, transparent);
      text-shadow: -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff,
        2px 2px 0 #fff;
    }
  }
  .casting-3 {
    .position-overlay {
      color: #c1611b;
      background: radial-gradient(#c1611b -114%, transparent);
      text-shadow: -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff,
        2px 2px 0 #fff;
    }
  }
`;

export const SubmitButton = styled(Button)`
  margin: 1em;
  width: 18em;
  height: 3em;
  color: white;
  background: orange;
  border: none;
`;
