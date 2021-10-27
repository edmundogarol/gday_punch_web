import styled from "styled-components";
import { device } from "utils/styles";

export const App = styled.div`
  .App-header-container {
    min-height: 56vh;
  }
`;

export const BrowseMore = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  font-size: 1.5em;
  color: orange;
  margin-bottom: 4em;
  margin-left: 2em;
  margin-right: 2em;

  h4,
  a {
    color: #eb9b08;
  }

  svg {
    height: 1.5em;
    width: 1.5em;
  }
`;
