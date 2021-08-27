import styled from "styled-components";
import { device } from "utils/styles";

export const App = styled.div`
  min-height: 84vh;
`;

export const ResetForm = styled.div`
  justify-content: space-evenly;
  display: flex;
  flex-direction: column;
  text-align: start;
  margin-bottom: 2em;
  margin-right: 2em;
  margin-left: 2em;

  h3 {
    font-weight: 100;
  }

  label {
    font-size: 1.2em;
  }

  button {
    margin-top: 2em;
    width: 50%;
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

export const EmailContainer = styled.div`
  display: flex;
  align-items: center;

  h4 {
    margin-bottom: unset;
    margin-right: 5em;
  }

  input {
    width: 50%;
  }
`;

export const RequiredField = styled.span`
  color: red;
  margin-left: 0.5em;
`;

export const SuccessLabel = styled.label`
  display: inherit;
  color: #697969;
  background: #f5f5f5;
  padding: 0.7em;
  border-radius: 4pt;
`;
