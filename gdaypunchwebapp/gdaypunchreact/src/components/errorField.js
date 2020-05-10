import styled from "styled-components";

export const ErrorField = styled.div`
  text-transform: initial;
  font-size: 0.8em;
  width: 100%;
  display: flex;
  justify-content: center;
  white-space: nowrap;

  div {
    color: white;
    height: 2em;
    background: #ff0000ad;
    border-radius: 0.4em;
    border: 1px solid red;
    margin: 1em;
    display: flex;
    align-items: center;
    padding: 1em;
    padding-left: 2em;
    padding-right: 2em;
    width: 100%;
    height: max-content;
    flex-wrap: wrap;
  }

  label {
    margin-right: 0.5em;
  }

  span {
    text-transform: capitalize;
  }

  p {
    margin: unset;
  }
`;
