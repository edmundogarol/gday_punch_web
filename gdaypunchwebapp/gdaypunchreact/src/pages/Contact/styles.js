import styled from "styled-components";

export const App = styled.div`
  .App-header-container {
    min-height: 56vh;
  }
`;

export const ContactForm = styled.div`
  height: 480pt;
  width: 300pt;
  justify-content: space-evenly;
  display: flex;
  flex-direction: column;
  text-align: start;
  margin-bottom: 2em;

  .ant-select {
    text-align: start;
    width: 100%;
    margin-bottom: 1em;
  }

  label {
    font-size: 1.2em;
  }

  button {
    margin-top: 1em;
  }
`;

export const RequiredField = styled.span`
  color: red;
  margin-left: 0.5em;
`;

export const ContactImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  flex-wrap: wrap;
  margin-right: 2em;
  margin-left: 2em;

  img {
    height: fit-content;
    margin-left: 5em;
  }
`;

export const SuccessLabel = styled.label`
  color: #4fbf4f;
  background: #deffde;
  padding: 0.7em;
  border-radius: 4pt;
`;
