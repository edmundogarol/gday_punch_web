import styled from "styled-components";
import { device } from "utils/styles";

export const App = styled.div`
  min-height: 84vh;

  .error-field {
    font-size: 1em;
  }
`;

export const SuccessLabel = styled.label`
  display: inherit;
  color: #697969;
  background: #f5f5f5;
  padding: 0.7em;
  border-radius: 4pt;
`;
