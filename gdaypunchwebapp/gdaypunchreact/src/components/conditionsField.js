import styled from "styled-components";

export const ConditionsField = styled.div`
  text-transform: initial;
  font-size: 0.7em;
  width: 100%;
  display: flex;
  justify-content: center;
  white-space: break-spaces;

  div {
    color: white;
    height: 2em;
    background: #b1b1b1ad;
    border-radius: 0.4em;
    border: 1px solid #c3c3c3;
    margin: 1em;
    display: flex;
    align-items: center;
    padding: 1em;
    padding-left: 2em;
    padding-right: 2em;
    width: 100%;
    height: max-content;
    text-align: start;
  }

  label {
    margin-right: 0.5em;
  }

  span {
    text-transform: capitalize;
  }

  p {
    margin: unset;
    margin-left: 1em;
  }
`;
