import styled from "styled-components";

export const AdminNav = styled.div`
  width: 30vh;
  padding-top: 11vh;
  background: #f1f1f1;
  display: flex;
  flex-direction: column;

  a {
    width: 100%;
    height: 3em;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: #333333;
    background: #d0d0d0;
    font-size: 1em;
  }

  a:hover {
    color: #f9f9f9;
    background: #6b6b6b;
  }

  .active {
    background: #ec9900;
    color: white;
    font-weight: 500;
  }
`;

export const AdminContentContainer = styled.div`
  width: 100%;
  padding: 2em;
  padding-top: 12vh;
`;
