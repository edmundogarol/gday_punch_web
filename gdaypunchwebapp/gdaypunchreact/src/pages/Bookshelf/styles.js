import styled from "styled-components";

export const App = styled.div`
  min-height: 84vh;

  .spinner {
    position: absolute;
    top: 50%;
    transform: scale(2);
  }
`;

export const EmptyBookshelfMessage = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 50%;

  div {
    display: flex;
    align-content: center;
    justify-content: center;
  }

  h4 {
    color: dimgray;
  }

  h2 {
    margin-bottom: unset;
    color: #efa114;
    text-decoration: underline;
    cursor: pointer;
  }

  svg {
    height: 2em;
    width: 2em;
    margin-left: 1em;
    color: #efa114;
  }
`;
