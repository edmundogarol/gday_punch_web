import styled from "styled-components";
import { device } from "utils/styles";

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

  &:hover {
    cursor: pointer;
    opacity: 1 !important;
  }
`;

export const VotingItemsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 47em;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 2em;

  ${(props) =>
    props.active
      ? `
        ${VotingItemImage}:not(.selected) {
          opacity: 0.5;
        }
        `
      : ""}

  &:hover {
    ${VotingItemImage}:not(.selected) {
      opacity: 0.5;
    }
  }

  .selected {
    opacity: 1;
    transform: scale(1.05);
  }
`;
